(function () {
    var Ctrl = null;
    define(['app', 'components/common/loading/loadingManager', 'app/shared/optionsService', 'app/assignRoles/roleBasedAssignmentService'], function (app) {
        if (Ctrl === null) {
            Ctrl = ['$scope', '$rootScope', '$q', 'OptionsService', 'RoleBasedAssignmentService', 'LoadingManager', function ($scope, $rootScope, $q, optionsService, roleBasedService, loadingManager) {
                $scope.assignment = {};

                loadingManager.startLoading();
                optionsService.getAvailableRoles()
                .success(function (data) {
                    $scope.availableRoles = data;
                })
                .error(function (data) {
                    $scope.availableRoles = [];
                    $rootScope.updateErrorMessage(data.Message);
                })
                .finally(function () {
                    loadingManager.stopLoading();
                });

                loadingManager.startLoading();
                optionsService.getAvailableUsers()
                .success(function (data) {
                    $scope.allAvailableUsers = data;
                })
                .error(function (data) {
                    $scope.allAvailableUsers = [];
                    $rootScope.updateErrorMessage(data.Message);
                })
                .finally(function () {
                    loadingManager.stopLoading();
                });

                $scope.$watch('assignment.Role', function (newValue, oldValue) {
                    if (newValue == oldValue) return;

                    $rootScope.updateErrorMessage(null);
                    loadingManager.startLoading();
                    roleBasedService.getAssignedUsersByRole(newValue)
                    .success(function (data) {
                        $scope.assignment.Users = data;
                    })
                    .error(function (data) {
                        $scope.assignment.Users = [];
                        $rootScope.updateErrorMessage(data.Message);
                    })
                    .finally(function () {
                        loadingManager.stopLoading();
                    });
                });
            }];
            app.lazy.controller('RoleBasedAssignmentController', Ctrl);
        }
    });
})();