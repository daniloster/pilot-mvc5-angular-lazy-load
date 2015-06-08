(function () {
    var loaded = false;
    define(['app', 'jquery', 'angular', 'bootstrap'], function (app, $, angular) {
        if (!loaded) {

            app.lazy.directive("modalTarget", ['ConfigApp', '$timeout', function (ConfigApp, $timeout) {
                return {
                    restrict: 'A',
                    scope: {
                        modalOnload: '&'
                    },
                    link: function ($scope, elem, attrs) {
                        var modalTimeout;
                        try {
                            modalTimeout = parseInt(attrs.modalTimeout);
                        } catch (e) {
                            modalTimeout = 10;
                        }
                        $(elem).on('click', function () {
                            var result = $scope.modalOnload();
                            $timeout(function () {
                                if (angular.isFunction(result) || angular.isObject(result)) {
                                    result.then(function (val) {
                                        if (val) {
                                            $(attrs.modalTarget).modal('show');
                                        }
                                    })
                                } else if (result != false) {
                                    $(attrs.modalTarget).modal('show');
                                }
                            }, modalTimeout);
                        });
                    }
                };
            }]);

            app.lazy.directive("modalDialog", ['ConfigApp', function (ConfigApp) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/modal/style.css')));

                var template = '<div class="modal fade" id="[MODAL:ID]" tabindex="-1" role="dialog" aria-labelledby="[MODAL:ID]Label" aria-hidden="true">' +
                '    <div class="modal-dialog">' +
                '        <div class="modal-content">' +
                '            <div class="modal-header [MODAL:HIDE-HEADER]">' +
                '                <button type="button" class="close [MODAL:SHOW-CLOSE]" confirm-no><span>&times;</span><span class="sr-only">Close</span></button>' +
                '                [MODAL:HEADER]' +
                '            </div>' + 
                '            <div class="modal-body [MODAL:HIDE-BODY]">' +
                '                [MODAL:BODY]' +
                '            </div>' +
                '            <div class="modal-footer [MODAL:HIDE-FOOTER]">' +
                '                [MODAL:FOOTER]' +
                '            </div>' +
                '        </div>' +
                '    </div>' +
                '</div>';

                return {
                    replace: true,
                    restrict: 'EA',
                    scope: {
                        confirmYes: '&',
                        confirmNo: '&'
                    },
                    compile: function (elem, attrs) {
                        
                        var header = elem.find('div.header').html() || '',
                        body = elem.find('div.body').html() || '',
                        footer = elem.find('div.footer').html() || '',
                        targetModalId = elem.attr('id'),
                        html = template.replace(' [MODAL:SHOW-CLOSE]', attrs.showClose === 'true' || attrs.showClose === true || attrs.showClose === undefined ? '' : ' ng-hide')
                            .replace('[MODAL:HEADER]', header).replace(' [MODAL:HIDE-HEADER]', header == '' ? ' ng-hide' : '')
                            .replace('[MODAL:BODY]', body).replace(' [MODAL:HIDE-BODY]', body == '' ? ' ng-hide' : '')
                            .replace('[MODAL:FOOTER]', footer).replace(' [MODAL:HIDE-FOOTER]', footer == '' ? ' ng-hide' : '')
                            .replace('[MODAL:ID]', targetModalId)
                            .replace('[MODAL:ID]', targetModalId),
                        newElem = $(html);

                        elem.replaceWith(newElem);

                        return function ($scope, iElem, iAttrs) {
                            $scope.showClose = (iAttrs.showClose === 'true' || iAttrs.showClose === true);
                            var zIndex = parseInt(elem.find('.modal-backdrop').css('z-index'));
                            elem.find('.modal-dialog').css('z-index', ++zIndex);

                            function show() {
                                $('#' + iAttrs.id).modal('show');
                            }

                            function hide() {
                                $('#' + iAttrs.id).modal('hide');
                            }

                            $scope.$on('modal:show:' + iAttrs.id, function (evt, arg) {
                                $scope.confirm.yes();
                            });

                            $scope.$on('modal:hide:' + iAttrs.id, function (evt, arg) {
                                $scope.confirm.no();
                            });

                            iElem.find('[confirm-yes]').on('click', function () {
                                $scope.confirm.yes();
                            });

                            iElem.find('[confirm-no]').on('click', function () {
                                $scope.confirm.no();
                            });

                            $scope.confirm = {
                                yes: function () {
                                    if (angular.isFunction($scope.confirmYes)) {
                                        var result = $scope.confirmYes();
                                        if (angular.isFunction(result) || angular.isObject(result)) {
                                            result.then(function (val) {
                                                hide();
                                            });
                                        } else if (result != false) {
                                            hide();
                                        }
                                    }
                                },
                                no: function () {
                                    if (angular.isFunction($scope.confirmNo)) {
                                        var result = $scope.confirmNo();
                                        if (angular.isFunction(result) || angular.isObject(result)) {
                                            result.then(function (val) {
                                                if (val) {
                                                    hide();
                                                }
                                            })
                                        } else if (result != false) {
                                            hide();
                                        }
                                    }
                                }
                            }
                        };
                    }
                };
            }]);

            loaded = true;
        }
    });
})();