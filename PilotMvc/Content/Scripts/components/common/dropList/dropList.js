(function () {
    var loaded = false;
    define(['angular', 'app', 'components/common/form/checkbox/checkbox', 'config/debugger'], function (angular, app) {
        if (!loaded) {

            app.lazy.directive("pilotItemClick", ['ConfigApp', function (ConfigApp) {
                return {                   
                    restrict: 'A',
                    scope: {
                        click: '&pilotItemClick'
                    },
                    link: function (scope, elem, attrs) {
                        $(elem).on('click', function (e) {
                            scope.$apply(function () {
                                scope.click();
                            });
                            e.preventDefault();
                        });
                    }
                };
            }]);

            app.lazy.directive("pilotDropList", ['ConfigApp', 'Debugger', function (ConfigApp, Debugger) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/dropList/style.css')));
                var itemTemplate = ''
                return {
                    restrict: 'EA',
                    templateUrl: function (tElement, tAttrs) {
                        itemTemplate = tElement.html();
                        tElement.html('');
                        return ConfigApp.getPath('/Content/Scripts/components/common/dropList/template.html');
                    },
                    controller: ['$scope', function ($scope) {
                        $scope.tracker = function (item) {
                            return item[$scope.itemTrack];
                        };

                        $scope.isSelected = function (item) {
                            return ($scope.listAssigned || []).filter(function (assigned) {
                                return assigned[$scope.itemTrack] == item[$scope.itemTrack];
                            }).length > 0;
                        };

                        $scope.toggleItem = function (item, $event) {
                            var index = ($scope.listAssigned || []).getIndex(function (assigned) {
                                return assigned[$scope.itemTrack] == item[$scope.itemTrack];
                            });
                            if (index > -1) {
                                ($scope.listAssigned || []).splice(index, 1);
                            } else {
                                ($scope.listAssigned || []).push(item);
                            }
                        };
                    }],
                    scope: {
                        displaySearch: '@pilotListDisplaySearch',
                        itemTrack: '@pilotListItemTrack',
                        listAll: '=pilotListAll',
                        listAssigned: '=pilotListAssigned'
                    },
                    compile: function (cElem, cAttrs, cTransclude) {
                        Debugger.debug('compiling: ', cElem.html());
                        Debugger.debug('compiling itemTemplate: ', itemTemplate);
                        cElem.find('[pilot-item-template]').html(itemTemplate);
                        return {
                            pre: function ($scope, elem, attrs, _c, transclude) {
                                Debugger.debug('pre link: ', elem.html());
                            },
                            post: function ($scope, elem, attrs) {
                                Debugger.debug('pre link: ', elem.html());
                            }
                        };
                    }
                };
            }]);

            loaded = true;
        }
    });
})();