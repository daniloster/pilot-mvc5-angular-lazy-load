(function () {
    var loaded = false;
    define(['angular', 'app', 'components/common/form/checkbox/checkbox'], function (angular, app) {
        if (!loaded) {
            app.lazy.directive("pilotDualList", ['ConfigApp', function (ConfigApp) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/dualList/style.css')));
                return {
                    controller: ['$scope', function ($scope) {

                       

                        $scope.isSelected = function (item) {

                        };

                    }],
                    restrict: 'EA',
                    templateUrl: ConfigApp.getPath('/Content/Scripts/components/common/dualList/template.html'),
                    scope: {
                        pilotListAll: '=',
                        pilotListAssigned: '='
                    },
                    link: function (scope, elem, attrs) {
                        scope.allItems = [];

                        var allListMerged = function () {
                            scope.allItems = [];

                        }
                    }
                };
            }]);
            loaded = true;
        }
    });
})();