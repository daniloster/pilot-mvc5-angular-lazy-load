(function () {
    var Ctrl = null;
    define(['app', 'components/common/loading/loadingService', 'modules/shared/optionsService', 'modules/assignRoles/roleBasedAssignmentService'], function (app) {
        if (Ctrl === null) {
            Ctrl = ['$scope', '$rootScope', '$q', 'OptionsService', 'RoleBasedAssignmentService', 'LoadingService', function ($scope, $rootScope, $q, optionsService, roleBasedService, loadingService) {
                $scope.assignment = {};

                loadingService.startLoading();
                optionsService.getAvailableRoles()
                .success(function (data) {
                    $scope.availableRoles = data;
                })
                .error(function (data) {
                    $scope.availableRoles = [];
                    $rootScope.updateErrorMessage(data.Message);
                })
                .finally(function () {
                    loadingService.stopLoading();
                });

                loadingService.startLoading();
                optionsService.getAvailableUsers()
                .success(function (data) {
                    allAvailableUsers = data;
                })
                .error(function (data) {
                    $scope.allAvailableUsers = [];
                    $rootScope.updateErrorMessage(data.Message);
                })
                .finally(function () {
                    loadingService.stopLoading();
                });

                $scope.$watch('assignment.Role', function (newValue, oldValue) {
                    if (newValue == oldValue) return;

                    if (!!newValue) {
                        $scope.allAvailableUsers = allAvailableUsers;
                    } else {
                        $scope.allAvailableUsers = [];
                    }

                    $rootScope.updateErrorMessage(null);
                    loadingService.startLoading();
                    roleBasedService.getAssignedUsersByRole(newValue)
                    .success(function (data) {
                        $scope.assignment.Users = data;
                    })
                    .error(function (data) {
                        $scope.assignment.Users = [];
                        $rootScope.updateErrorMessage(data.Message);
                    })
                    .finally(function () {
                        loadingService.stopLoading();
                    });
                });

                $scope.assign = function (form) {
                    if (form.$valid) {
                        loadingService.startLoading();
                        roleBasedService.assign({ idUser: $scope.assignment.Role.Id, idRoles: ($scope.assignment.Users || []).map(function (user) { return user.Id }) })
                        .success(function (data) {
                            $scope.$broadcast('ValidateFormAndSubmit[' + form.$name + ']', { message: data.Message });
                        })
                        .finally(function () {
                            loadingService.stopLoading();
                        });
                    }
                };
            }];
            app.lazy.controller('RoleBasedAssignmentController', Ctrl);
        }
    });
})();