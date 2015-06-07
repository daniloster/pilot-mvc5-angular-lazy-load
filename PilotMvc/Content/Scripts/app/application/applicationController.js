(function () {
    var Ctrl = null;
    define(['app', 'components/common/loading/loadingController', 'app/application/applicationService'], function (app, loadingCtrl) {
        if (Ctrl === null) {
            Ctrl = ['$scope', '$rootScope', '$q', 'ApplicationService', function ($scope, $rootScope, $q, applicationService) {
                loadingCtrl.clear(false);

                $scope.pageSize = 4;
                $scope.currentPage = 1;

                $scope.getAll = function () {
                    loadingCtrl.startLoading();
                    applicationService.query($scope.filter, function (data) {
                        $scope.apps = data;
                        loadingCtrl.stopLoading();
                    }, function (data) {
                        $scope.apps = undefined;
                        $scope.error = data.Message;
                        loadingCtrl.stopLoading();
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
                        $scope.getAll();
                    }, function (data) {
                        $rootScope.updateErrorMessage(data.Message);
                        loadingCtrl.stopLoading();
                        task.reject();
                    });
                    return task.promise;
                };

                //Used to delete a record  
                $scope['delete'] = function () {
                    loadingCtrl.startLoading();
                    applicationService.delete({ Id: $scope.deletingItem.Id }, function (data) {
                        $scope.getAll();
                        loadingCtrl.stopLoading();
                    }, function (data) {
                        loadingCtrl.stopLoading();
                        $scope.error = data.Message;

                    });
                };

                $scope.getAll();
            }];
            app.lazy.controller('ApplicationController', Ctrl);
        }
    });
})();