(function () {
    var Ctrl = null;
    define(['app', 'components/common/loading/loadingManager', 'modules/resource/resourceService', 'modules/shared/optionsService'], function (app) {
        if (Ctrl === null) {
            Ctrl = ['$scope', '$rootScope', '$q', 'ResourceService', 'OptionsService', 'LoadingManager', function ($scope, $rootScope, $q, resourceService, optionsService, loadingManager) {
                $scope.hasSearched = false;
                $scope.pageSize = 4;
                $scope.currentPage = 1;

                $scope.search = function () {
                    loadingManager.startLoading();
                    resourceService.query($scope.filter)
                    .success(function (data) {
                        $scope.resources = data;
                        $scope.hasSearched = true;
                    })
                    .error(function (data) {
                        $scope.resources = undefined;
                        $rootScope.updateErrorMessage(data.Message);
                        $scope.hasSearched = true;
                    })
                    .finally(function () {
                        loadingManager.stopLoading();
                    });
                };

                $scope.setDeletingItem = function (item) {
                    $scope.deletingItem = item;
                };

                $scope.clearDeletingItem = function () {
                    $scope.setDeletingItem(null);
                };

                $scope.setCurrent = function (item) {
                    if (item != null) {
                        item = JSON.parse(JSON.stringify(item));
                    }
                    $scope.current = item;
                };

                $scope.clearCurrent = function () {
                    $scope.setCurrent(null);
                };

                //Used to save a record after edit  
                $scope.save = function () {
                    var task = $q.defer();
                    loadingManager.startLoading();
                    var isUpdating = !!$scope.current && $scope.current.Id > 0;
                    resourceService.save($scope.current)
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
                        loadingManager.stopLoading();
                    });
                    return task.promise;
                };

                //Used to delete a record  
                $scope.remove = function () {
                    var task = $q.defer();
                    loadingManager.startLoading();
                    resourceService.remove({ id: $scope.deletingItem.Id })
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
                        loadingManager.stopLoading();
                    });
                };

                optionsService.getAvailableApps()
                .success(function (data) {
                    $scope.availableApplications = data;
                })
                .error(function (data) {
                    $scope.availableApplications = [];
                    $rootScope.updateErrorMessage(data.Message);
                })
                .finally(function () {
                    loadingManager.stopLoading();
                });

                optionsService.getAllResourceTypes()
                .success(function (data) {
                    $scope.availableResourceTypes = data;
                })
                .error(function (data) {
                    $scope.availableResourceTypes = [];
                    $rootScope.updateErrorMessage(data.Message);
                })
                .finally(function () {
                    loadingManager.stopLoading();
                });

                $scope.search();
            }];
            app.lazy.controller('ResourceController', Ctrl);
        }
    });
})();