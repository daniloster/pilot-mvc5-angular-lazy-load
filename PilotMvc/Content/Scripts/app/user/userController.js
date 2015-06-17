(function () {
    var Ctrl = null;
    define(['app', 'components/common/loading/loadingController', 'components/common/form/customValidator', 'app/user/userService'], function (app, loadingCtrl, CustomValidator) {
        if (Ctrl === null) {
            Ctrl = ['$scope', '$rootScope', '$q', 'UserService', function ($scope, $rootScope, $q, userService) {
                loadingCtrl.clear(false);

                $scope.hasSearched = false;
                $scope.pageSize = 4;
                $scope.currentPage = 1;

                $scope.search = function () {
                    loadingCtrl.startLoading();
                    userService.query($scope.filter, function (data) {
                        $scope.users = data;
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
                    userService.save($scope.current, function (data) {
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
                    userService.delete({ id: $scope.deletingItem.Id }, function (data) {
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

                /* Validation methods */
                $scope.validatePassword = [new CustomValidator('equal', ['confirmingPassword'], function (value) {
                    return ((!value && !$scope.confirmingPassword) || value == $scope.confirmingPassword);
                })];
                /* End validation methods */

                $scope.search();
            }];
            app.lazy.controller('UserController', Ctrl);
        }
    });
})();