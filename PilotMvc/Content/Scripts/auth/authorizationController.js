(function () {
    var Ctrl = null;
    define(['app', 'components/common/loading/loadingManager'], function (app) {
        if (Ctrl == null) {
            Ctrl = ['$scope', '$rootScope', '$location', 'LoadingManager', 'AuthorizationService', function ($scope, $rootScope, $location, loadingManager, authorizationService) {
                $scope.login = function () {
                    loadingManager.startLoading();
                    $rootScope.updateErrorMessage(null);
                    $scope.user = $scope.user || {};
                    $scope.user.rememberMe = !!$scope.user.rememberMe;
                    authorizationService.login($scope.user)
                    .success(function (data) {
                        $location.path('/');
                    })
                    .error(function (data) {
                        $rootScope.updateErrorMessage(data.Message);
                    })
                    .finally(function () {
                        loadingManager.stopLoading();
                    });
                };

                $scope.logout = function () {
                    loadingManager.startLoading();
                    $rootScope.updateErrorMessage(null);
                    authorizationService.logout()
                    .success(function (data) {
                        $location.path('/login');
                    })
                    .error(function (data) {
                        $rootScope.updateErrorMessage(data.Message);
                    })
                    .finally(function () {
                        loadingManager.stopLoading();
                    });
                };
            }];

            app.lazy.controller('AuthorizationController', Ctrl);
        };
    });
})();