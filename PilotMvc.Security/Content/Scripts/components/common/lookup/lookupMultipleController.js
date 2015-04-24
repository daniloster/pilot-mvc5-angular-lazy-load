(function () {
    var Ctrl = null;
    define(['angular', 'app', 'auth/session', 'components/common/loading/loadingController', 'components/common/services/jsonService'],
    function (angular, app, session, loadingController) {
        if (Ctrl == null) {
            Ctrl = ['$scope', '$rootScope', '$location', 'JsonService', function ($scope, $rootScope, $location, jsonService) {
                $scope.selecteds = $scope.selecteds == undefined ? [] : $scope.selecteds;
                var selecteds = $scope.selecteds.map(function (item) { return item; });

                $scope.$watch('selecteds', function (nval, oval) {
                    if (nval === oval) return;
                    selecteds = ((nval == null || nval == undefined) ? ($scope.selecteds = []) : nval).map(function (item) { return item; });
                });

                // Declaring the lookup function
                $scope.lookup = function (query) {
                    if (query == undefined || query == null || query == '') {
                        if (!!$scope.sourceArgs.query) {
                            delete $scope.sourceArgs['query'];
                        }
                    } else {
                        if (!$scope.sourceArgs) {
                            $scope.sourceArgs = {};
                        }
                        $scope.sourceArgs.query = query;
                    }
                    loadingController.startLoading();
                    jsonService.postData($scope.sourceRef, $scope.sourceArgs, function (data) {
                        $scope.dataSource = data;
                        loadingController.stopLoading();
                    }, function (data) {
                        $scope.dataSource = [];
                        loadingController.stopLoading();
                    });
                };

                $scope.isSelected = function (item) {
                    return $scope.selecteds.contains(function (inner) {
                        return item[$scope.idProperty] === inner[$scope.idProperty];
                    });
                };

                $scope.isAvailable = function (item) {
                    return ! $scope.isSelected(item);
                };

                $scope.select = function (item) {
                    if (item != undefined && item != null && $scope.isAvailable(item)) {
                        selecteds.push(item);
                        $scope.selecteds = selecteds.map(function (item) { return item; });
                    }
                    $scope.dataSource = [];
                };

                $scope.remove = function (item) {
                    if (item != undefined && item != null && $scope.isSelected(item)) {
                        var idx = selecteds.getIndex(function (it) {
                            return it[$scope.idProperty] === item[$scope.idProperty];
                        });
                        selecteds.splice(idx, 1);
                        $scope.selecteds = selecteds.map(function (item) { return item; });
                    }
                };

                /*

                idProperty: '@',
                labelProperty: '@?',
                dataSourceRef: '@?',
                dataSourceArgs: '=?',
                selecteds: '='

                */

            }];
            app.lazy.controller('LookupMultipleController', Ctrl);
        }
    });
})();