(function () {
    var Ctrl = null;
    define(['app', 'components/common/loading/loadingController', 'app/role/roleService', 'app/shared/optionsService'], function (app, loadingCtrl) {
        if (Ctrl === null) {
            Ctrl = ['$scope', '$rootScope', '$q', 'RoleService', 'OptionsService', function ($scope, $rootScope, $q, roleService, optionsService) {
                loadingCtrl.clear(false);

                $scope.hasSearched = false;
                $scope.pageSize = 4;
                $scope.currentPage = 1;

                $scope.search = function () {
                    loadingCtrl.startLoading();
                    roleService.query($scope.filter, function (data) {
                        $scope.roles = data;
                        loadingCtrl.stopLoading();
                        $scope.hasSearched = true;
                    }, function (data) {
                        $scope.roles = undefined;
                        $rootScope.updateErrorMessage(data.Message);
                        loadingCtrl.stopLoading();
                        $scope.hasSearched = true;
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
                        item.Application = $scope.availableApplications.filter(function (it) {
                            return (item.Application.Id == it.Id);
                        })[0];
                    }
                    $scope.current = item;
                };

                $scope.clearCurrent = function () {
                    $scope.setCurrent(null);
                };

                //Used to save a record after edit  
                $scope.save = function () {
                    var task = $q.defer();
                    loadingCtrl.startLoading();
                    var isUpdating = !!$scope.current && $scope.current.Id > 0;
                    roleService.save($scope.current, function (data) {
                        $rootScope.updateSuccessMessage(data.Message);
                        loadingCtrl.stopLoading();
                        task.resolve();
                        $scope.search();
                    }, function (data) {
                        $rootScope.updateErrorMessage(data.Message);
                        loadingCtrl.stopLoading();
                        task.reject();
                    });
                    return task.promise;
                };

                //Used to delete a record  
                $scope['delete'] = function () {
                    var task = $q.defer();
                    loadingCtrl.startLoading();
                    roleService.delete({ id: $scope.deletingItem.Id }, function (data) {
                        $rootScope.updateSuccessMessage(data.Message);
                        loadingCtrl.stopLoading();
                        task.resolve();
                        $scope.search();
                    }, function (data) {
                        $rootScope.updateErrorMessage(data.Message);
                        loadingCtrl.stopLoading();
                        task.reject();

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