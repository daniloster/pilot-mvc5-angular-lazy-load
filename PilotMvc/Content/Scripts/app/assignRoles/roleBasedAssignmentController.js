(function () {
    var Ctrl = null;
    define(['app', 'components/common/loading/loadingController', 'app/shared/access/optionsService', 'app/assignRoles/roleBasedAssignmentService'], function (app, loadingCtrl) {
        if (Ctrl === null) {
            Ctrl = ['$scope', '$rootScope', '$q', 'OptionsService', 'RoleBasedAssignmentService', function ($scope, $rootScope, $q, optionsService, roleBasedService) {
                loadingCtrl.clear(false);

                optionsService.getAvailableRoles(function (data) {

                }, function (data) {

                });

                optionsService.getAvailableUsers(function (data) {

                }, function (data) {

                });

                $scope.$watch('assignment.Role', function (newValue, oldValue) {
                    if (newValue == oldValue) return;

                    roleBasedService.getAvailableUsersByRole(function (data) {

                    }, function (data) {

                    });
                });

                $scope.search();
            }];
            app.lazy.controller('RoleBasedAssignmentController', Ctrl);
        }
    });
})();