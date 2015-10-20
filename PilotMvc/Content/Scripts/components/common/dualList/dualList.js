(function () {
    var loaded = false;
    define(['angular', 'app', 'config/debugger'], function (angular, app) {
        if (!loaded) {

            app.lazy.directive("dualList", ['ConfigApp', 'Debugger', function (ConfigApp, Debugger) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/dualList/style.css')));
                var itemTemplate = ''
                return {
                    restrict: 'EA',
                    templateUrl: function (tElement, tAttrs) {
                        itemTemplate = tElement.html();
                        tElement.html('');
                        return ConfigApp.getPath('/Content/Scripts/components/common/dualList/template.html');
                    },
                    controller: ['$scope', function ($scope) {
                        $scope.label = $scope.label || 'Links';
                        $scope.itemTrack = $scope.itemTrack || 'Id';
                        $scope.showOrdering = $scope.showOrdering != 'false';
                        $scope.listAssigned = ($scope.listAssigned || []);

                        $scope.isSelected = function (item) {
                            if (!!$scope.listAllAssigned && $scope.listAllAssigned.length > -1) {
                                return $scope.listAllAssigned.filter(function (assigned) {
                                    return assigned[$scope.itemTrack] == item[$scope.itemTrack];
                                }).length > 0;
                            } else {
                                return $scope.listAssigned.filter(function (assigned) {
                                    return assigned[$scope.itemTrack] == item[$scope.itemTrack];
                                }).length > 0;
                            }
                        };

                        $scope.toggleItem = function (item, /* declarations */ index, indexForGenericList, hasGenericList) {
                            hasGenericList = !!$scope.listAllAssigned && $scope.listAllAssigned.length > -1;
                            if (hasGenericList) {
                                indexForGenericList = $scope.listAllAssigned.getIndex(function (assigned) {
                                    return assigned[$scope.itemTrack] == item[$scope.itemTrack];
                                });
                            }
                            index = $scope.listAssigned.getIndex(function (assigned) {
                                return assigned[$scope.itemTrack] == item[$scope.itemTrack];
                            });
                            if (index > -1) {
                                $scope.listAssigned.splice(index, 1);
                                if (hasGenericList) {
                                    $scope.listAllAssigned.splice(indexForGenericList, 1);
                                }
                                $scope.listHasChanged();
                            } else if ($scope.maxItems === undefined || $scope.listAssigned.length < parseInt($scope.maxItems)) {
                                $scope.listAssigned.push(item);
                                if (hasGenericList) {
                                    $scope.listAllAssigned.push(item);
                                }
                                $scope.listHasChanged();
                            }
                        };

                        $scope.moveUp = function ($index, $event) {
                            $event.stopImmediatePropagation();
                            if ($index > 0) {
                                $scope.listAssigned = $scope.listAssigned.map(function (it, idx) {
                                    if (idx == $index) {
                                        return $scope.listAssigned[$index - 1];
                                    } else if (idx == $index - 1) {
                                        return $scope.listAssigned[$index];
                                    }
                                    return it;
                                });
                                $scope.listHasChanged();
                            }
                        };

                        $scope.moveDown = function ($index, $event) {
                            $event.stopImmediatePropagation();
                            if ($index > -1 && $scope.listAssigned.length - 1 > $index) {
                                $scope.listAssigned = $scope.listAssigned.map(function (it, idx) {
                                    if (idx == $index) {
                                        return $scope.listAssigned[$index + 1];
                                    } else if (idx == $index + 1) {
                                        return $scope.listAssigned[$index];
                                    }
                                    return it;
                                });
                                $scope.listHasChanged();
                            }
                        };
                    }],
                    scope: {
                        label: '@dualListLabel',
                        showOrdering: '=',
                        itemTrack: '@',
                        listAll: '=',
                        listAssigned: '=',
                        listAllAssigned: '=?',
                        maxItems: '=?',
                        listHasChanged: '&?'
                    },
                    compile: function (cElem, cAttrs, cTransclude) {
                        var hash = new Date().getTime();
                        Debugger.debug('compiling: ', cElem.html());
                        Debugger.debug('compiling itemTemplate: ', itemTemplate);
                        cElem.html(cElem.html().replace('[HASH_ID]', hash));
                        cElem.find('[dual-list-item-template]').html(itemTemplate);
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