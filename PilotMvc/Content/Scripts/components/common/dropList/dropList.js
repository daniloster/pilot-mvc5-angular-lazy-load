(function () {
    var loaded = false;
    define(['angular', 'app', 'components/common/form/checkbox/checkbox'], function (angular, app) {
        if (!loaded) {
            app.lazy.directive("pilotDropList", ['ConfigApp', function (ConfigApp) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/dropList/style.css')));
                return {
                    controller: ['$scope', function ($scope) {

                        $scope.isSelected = function (item) {
                            return $scope.pilotListAssigned.filter(function (assigned) {
                                return assigned[$scope.pilotListItemTrack] == item[$scope.pilotListItemTrack];
                            }).length > 0;
                        };

                        $scope.toggleItem = function (item) {
                            var index = $scope.pilotListAssigned.getIndex(function (assigned) {
                                return assigned[$scope.pilotListItemTrack] == item[$scope.pilotListItemTrack];
                            });
                            if (index > -1) {
                                $scope.pilotListAssigned.splice(index, 1);
                            } else {
                                $scope.pilotListAssigned.push(item);
                            }
                        };

                    }],
                    restrict: 'EA',
                    templateUrl: ConfigApp.getPath('/Content/Scripts/components/common/dropList/template.html'),
                    scope: {
                        pilotListItemTrack: '@',
                        pilotListAll: '=',
                        pilotListAssigned: '='
                    },
                    compile: function (cElem, cAttrs) {
                        var itemTemplate = cElem.html();
                        cElem.empty();
                        return function (scope, elem, attrs) {
                            scope.itemTemplate = itemTemplate;
                        };
                    }
                        
                };
            }]);
            loaded = true;
        }
    });
})();