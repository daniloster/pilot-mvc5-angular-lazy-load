(function () {
    var Ctrl = null;
    define(['app', 'components/common/loading/loadingController', 'app/shared/optionsService', 'app/assignRoles/roleBasedAssignmentService'], function (app, loadingCtrl) {
        if (Ctrl === null) {
            Ctrl = ['$scope', '$rootScope', '$q', 'OptionsService', 'RoleBasedAssignmentService', function ($scope, $rootScope, $q, optionsService, roleBasedService) {
                loadingCtrl.clear(false);

                $scope.assignment = {};

                loadingCtrl.startLoading();
                optionsService.getAvailableRoles(function (data) {
                    $scope.availableRoles = data;
                    loadingCtrl.stopLoading();
                }, function (data) {
                    $scope.availableRoles = [];
                    $rootScope.updateErrorMessage(data.Message);
                    loadingCtrl.stopLoading();
                });

                loadingCtrl.startLoading();
                optionsService.getAvailableUsers(function (data) {
                    $scope.allAvailableUsers = data;
                    loadingCtrl.stopLoading();
                }, function (data) {
                    $scope.allAvailableUsers = [];
                    $rootScope.updateErrorMessage(data.Message);
                    loadingCtrl.stopLoading();
                });

                $scope.$watch('assignment.Role', function (newValue, oldValue) {
                    if (newValue == oldValue) return;

                    $rootScope.updateErrorMessage(null);
                    loadingCtrl.startLoading();
                    roleBasedService.getAssignedUsersByRole(newValue, function (data) {
                        $scope.assignment.Users = data;
                        loadingCtrl.stopLoading();
                    }, function (data) {
                        $scope.assignment.Users = [];
                        $rootScope.updateErrorMessage(data.Message);
                        loadingCtrl.stopLoading();
                    });
                });
            }];
            app.lazy.controller('RoleBasedAssignmentController', Ctrl);
        }
    });
})();