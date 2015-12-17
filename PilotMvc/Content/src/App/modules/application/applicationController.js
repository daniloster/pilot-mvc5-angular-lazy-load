(function () {
    var Ctrl = null;
    define(['app', 'components/common/loading/loadingService', 'modules/application/applicationService'], function (app) {
        if (Ctrl === null) {
            Ctrl = ['$scope', '$rootScope', '$q', 'ApplicationService', 'LoadingService', function ($scope, $rootScope, $q, applicationService, loadingService) {
                $scope.hasSearched = false;
                $scope.pageSize = 4;
                $scope.currentPage = 1;

                $scope.search = function () {
                    loadingService.startLoading();
                    applicationService.query($scope.filter)
                    .success(function (data) {
                        $scope.apps = data;
                        $scope.hasSearched = true;
                    })
                    .error(function (data) {
                        $scope.apps = undefined;
                        $rootScope.updateErrorMessage(data.Message);
                        $scope.hasSearched = true;
                    })
                    .finally(function () {
                        loadingService.stopLoading();
                    });
                };

                $scope.setDeletingItem = function (item) {
                    $scope.deletingItem = item;
                };

                $scope.clearDeletingItem = function () {
                    $scope.setDeletingItem(null);
                };

                $scope.setCurrent = function (item) {
                    $scope.current = item;
                };

                $scope.clearCurrent = function () {
                    $scope.setCurrent(null);
                };

                //Used to save a record after edit  
                $scope.save = function () {
                    var task = $q.defer();
                    loadingService.startLoading();
                    var isUpdating = !!$scope.current && $scope.current.Id > 0;
                    applicationService.save($scope.current)
                    .success(function (data) {
                        $rootScope.updateSuccessMessage(data.Message);
                        task.resolve();
                        $scope.search();
                    })
                    .error(function (data) {
                        $rootScope.updateErrorMessage(data.Message);
                        task.reject();
                    })
                    .finally(function () {
                        loadingService.stopLoading();
                    });
                    return task.promise;
                };

                //Used to delete a record  
                $scope.remove = function () {
                    var task = $q.defer();
                    loadingService.startLoading();
                    applicationService.remove({ id: $scope.deletingItem.Id })
                    .success(function (data) {
                        $rootScope.updateSuccessMessage(data.Message);
                        task.resolve();
                        $scope.search();
                    })
                    .error(function (data) {
                        $rootScope.updateErrorMessage(data.Message);
                        task.reject();
                    })
                    .finally(function () {
                        loadingService.stopLoading();
                    });
                };

                $scope.search();
            }];
            app.lazy.controller('ApplicationController', Ctrl);
        }
    });
})();