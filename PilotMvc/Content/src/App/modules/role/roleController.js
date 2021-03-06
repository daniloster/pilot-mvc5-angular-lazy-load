(function () {
    var Ctrl = null;
    define(['app', 'components/common/loading/loadingService', 'modules/role/roleService', 'modules/shared/optionsService'], function (app) {
        if (Ctrl === null) {
            Ctrl = ['$scope', '$rootScope', '$q', 'RoleService', 'OptionsService', 'LoadingService', function ($scope, $rootScope, $q, roleService, optionsService, loadingService) {

                $scope.hasSearched = false;
                $scope.pageSize = 4;
                $scope.currentPage = 1;

                $scope.search = function () {
                    loadingService.startLoading();
                    roleService.query($scope.filter)
                    .success(function (data) {
                        $scope.roles = data;
                        $scope.hasSearched = true;
                    })
                    .error(function (data) {
                        $scope.roles = undefined;
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
                    loadingService.startLoading();
                    var isUpdating = !!$scope.current && $scope.current.Id > 0;
                    roleService.save($scope.current)
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
                    roleService.remove({ id: $scope.deletingItem.Id })
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

                optionsService.getAvailableApps(function (data) {
                    $scope.availableApplications = data;
                }, function (data) {
                    $scope.availableApplications = [];
                    $rootScope.updateErrorMessage(data.Message);
                });

                $scope.search();
            }];
            app.lazy.controller('RoleController', Ctrl);
        }
    });
})();