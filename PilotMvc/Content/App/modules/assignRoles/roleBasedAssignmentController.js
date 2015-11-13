(function () {
    var Ctrl = null;
    define(['app', 'components/common/loading/loadingManager', 'modules/shared/optionsService', 'modules/assignRoles/roleBasedAssignmentService'], function (app) {
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
                    allAvailableUsers = data;
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

                    if (!!newValue) {
                        $scope.allAvailableUsers = allAvailableUsers;
                    } else {
                        $scope.allAvailableUsers = [];
                    }

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

                $scope.assign = function (form) {
                    if (form.$valid) {
                        loadingManager.startLoading();
                        roleBasedService.assign({ idUser: $scope.assignment.Role.Id, idRoles: ($scope.assignment.Users || []).map(function (user) { return user.Id }) })
                        .success(function (data) {
                            $scope.$broadcast('ValidateFormAndSubmit[' + form.$name + ']', { message: data.Message });
                        })
                        .finally(function () {
                            loadingManager.stopLoading();
                        });
                    }
                };
            }];
            app.lazy.controller('RoleBasedAssignmentController', Ctrl);
        }
    });
})();