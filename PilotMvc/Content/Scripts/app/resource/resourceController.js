(function () {
    var Ctrl = null;
    define(['app', 'components/common/loading/loadingController', 'app/resource/resourceService', 'app/shared/optionsService'], function (app, loadingCtrl) {
        if (Ctrl === null) {
            Ctrl = ['$scope', '$rootScope', '$q', 'ResourceService', 'OptionsService', function ($scope, $rootScope, $q, resourceService, optionsService) {
                loadingCtrl.clear(false);

                $scope.hasSearched = false;
                $scope.pageSize = 4;
                $scope.currentPage = 1;

                $scope.search = function () {
                    loadingCtrl.startLoading();
                    resourceService.query($scope.filter, function (data) {
                        $scope.resources = data;
                        loadingCtrl.stopLoading();
                        $scope.hasSearched = true;
                    }, function (data) {
                        $scope.resources = undefined;
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
                    resourceService.save($scope.current, function (data) {
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
                    resourceService.delete({ id: $scope.deletingItem.Id }, function (data) {
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

                optionsService.getAllResourceTypes(function (data) {
                    $scope.availableResourceTypes = data;
                }, function (data) {
                    $scope.availableResourceTypes = [];
                    $rootScope.updateErrorMessage(data.Message);
                });

                $scope.search();
            }];
            app.lazy.controller('ResourceController', Ctrl);
        }
    });
})();