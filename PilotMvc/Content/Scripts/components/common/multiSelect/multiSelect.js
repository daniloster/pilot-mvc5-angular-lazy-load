(function () {
    var loaded = false;
    define(['app', 'components/common/form/checkbox/checkbox'], function (app) {
        if (!loaded) {
            app.lazy.directive("multiSelectClick", ['ConfigApp', function (ConfigApp) {
                return {                   
                    restrict: 'A',
                    scope: {
                        click: '&multiSelectClick'
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

            app.lazy.directive("multiSelect", ['ConfigApp', function (ConfigApp) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/multiSelect/bootstrap-multiselect.css')));
                return {
                    restrict: 'EA',
                    templateUrl: ConfigApp.getPath('/Content/Scripts/components/common/multiSelect/template.html'),
                    scope: {
                        selecteds: '=multiSelect',
                        allOptions: '=multiSelectOptions',
                        labelOption: '@multiSelectLabel',
                        idOption: '@multiSelectId',
                        defaultMessage: '@multiSelectEmpty'
                    },
                    controller: ['$scope', function ($scope) {
                        $scope.getTracker = function (item) {
                            return item[$scope.idOption];
                        };

                        $scope.getDescription = function (item) {
                            return item[$scope.labelOption];
                        };

                        $scope.isSelected = function (item) {
                            return ($scope.selecteds || []).filter(function (assigned) {
                                return $scope.getTracker(assigned) == $scope.getTracker(item);
                            }).length > 0;
                        };

                        $scope.toggleItem = function (item) {
                            var index = ($scope.selecteds || []).getIndex(function (assigned) {
                                return $scope.getTracker(assigned) == $scope.getTracker(item);
                            });
                            if (index > -1) {
                                ($scope.selecteds || []).splice(index, 1);
                            } else {
                                ($scope.selecteds || []).push(item);
                            }
                            $scope.updateAllDescriptions();
                        };

                        $scope.updateAllDescriptions = function () {
                            $scope.allSelected = ($scope.selecteds || []).length == 0 ?
                                (!!$scope.defaultMessage ? $scope.defaultMessage : 'None selected') :
                                $scope.selecteds.map(function (item) { return $scope.getDescription(item) }).join(', ');
                        };
                        
                    }],
                    compile: function (cElem, cAttrs) {
                        cElem.addClass('multiselect-master-container');
                        return function ($scope, elem, attrs) {
                            $scope.updateAllDescriptions();
                        };
                    }
                };
            }]);
            loaded = true;
        }
    });
})();