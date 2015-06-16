(function () {
    var Ctrl = null;
    define(['app', 'components/common/loading/loadingController', 'app/application/applicationService'], function (app, loadingCtrl) {
        if (Ctrl === null) {
            Ctrl = ['$scope', '$rootScope', '$q', 'ApplicationService', function ($scope, $rootScope, $q, applicationService) {
                loadingCtrl.clear(false);

                $scope.hasSearched = false;
                $scope.pageSize = 4;
                $scope.currentPage = 1;

                $scope.search = function () {
                    loadingCtrl.startLoading();
                    applicationService.query($scope.filter, function (data) {
                        $scope.apps = data;
                        loadingCtrl.stopLoading();
                        $scope.hasSearched = true;
                    }, function (data) {
                        $scope.apps = undefined;
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
                    applicationService.save($scope.current, function (data) {
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
                    applicationService.delete({ id: $scope.deletingItem.Id }, function (data) {
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

                $scope.search();
            }];
            app.lazy.controller('ApplicationController', Ctrl);
        }
    });
})();