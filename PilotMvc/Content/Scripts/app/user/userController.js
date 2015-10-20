(function () {
    var Ctrl = null;
    define(['app', 'components/common/loading/loadingManager', 'app/user/userService'], function (app) {
        if (Ctrl === null) {
            Ctrl = ['$scope', '$rootScope', '$q', 'LoadingManager', 'UserService', 'CustomValidatorFactory', function ($scope, $rootScope, $q, loadingManager, userService, customValidatorFactory) {
                loadingManager.clear(false);

                $scope.hasSearched = false;
                $scope.pageSize = 4;
                $scope.currentPage = 1;

                $scope.search = function () {
                    loadingManager.startLoading();
                    userService.query($scope.filter)
                    .success(function (data) {
                        $scope.users = data;
                        $scope.hasSearched = true;
                    })
                    .error(function (data) {
                        $scope.apps = undefined;
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
                    userService.save($scope.current)
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
                    userService.remove({ id: $scope.deletingItem.Id })
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

                /* Validation methods */
                $scope.validatePassword = [customValidatorFactory.create('equal', ['confirmingPassword'], function (value) {
                    return ((!value && !$scope.confirmingPassword) || value == $scope.confirmingPassword);
                })];
                /* End validation methods */

                $scope.search();
            }];
            app.lazy.controller('UserController', Ctrl);
        }
    });
})();