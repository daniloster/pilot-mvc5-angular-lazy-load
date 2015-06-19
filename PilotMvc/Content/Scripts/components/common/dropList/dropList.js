(function () {
    var loaded = false;
    define(['angular', 'app', 'components/common/form/checkbox/checkbox'], function (angular, app) {
        if (!loaded) {

            app.lazy.directive("pilotItemClick", ['ConfigApp', function (ConfigApp) {
                return {
                    restrict: 'A',
                    scope: {
                        click: '&pilotItemClick'
                    },
                    link: function (scope, elem, attrs) {
                        $(elem).find('label').on('click', function () {
                            scope.$apply(function () {
                                scope.click();
                            });
                        });
                        $(elem).on('click', function () {
                            scope.$apply(function () {
                                scope.click();
                            });
                        });
                    }
                };
            }]);

            app.lazy.directive("pilotDropList", ['ConfigApp', function (ConfigApp) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/dropList/style.css')));
                return {
                    restrict: 'EA',
                    templateUrl: ConfigApp.getPath('/Content/Scripts/components/common/dropList/template.html'),
                    //template: template,
                    transclude: true,
                    replace: true,
                    scope: {
                        itemTrack: '@pilotListItemTrack',
                        listAll: '=pilotListAll',
                        listAssigned: '=pilotListAssigned'
                    },
                    link: function ($scope, elem, attrs) {
                        $scope.isSelected = function (item) {
                            return ($scope.listAssigned || []).filter(function (assigned) {
                                return assigned[$scope.itemTrack] == item[$scope.itemTrack];
                            }).length > 0;
                        };

                        $scope.toggleItem = function (item) {
                            var index = ($scope.listAssigned || []).getIndex(function (assigned) {
                                return assigned[$scope.itemTrack] == item[$scope.itemTrack];
                            });
                            if (index > -1) {
                                ($scope.listAssigned || []).splice(index, 1);
                            } else {
                                ($scope.listAssigned || []).push(item);
                            }
                        };
                    }
                };
            }]);

            loaded = true;
        }
    });
})();