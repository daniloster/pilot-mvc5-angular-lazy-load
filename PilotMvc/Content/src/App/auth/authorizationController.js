(function () {
    var loaded = false;

    AuthorizationController.$inject = ['$scope', '$rootScope', '$state', '$location', 'AuthorizationService', 'LoadingService', 'Session'];
    function AuthorizationController($scope, $rootScope, $state, $location, authorizationService, loadingService, session) {
        $scope.login = function () {
            loadingService.startLoading();
            $rootScope.updateErrorMessage(null);
            $scope.user = $scope.user || {};
            $scope.user.rememberMe = !!$scope.user.rememberMe;
            authorizationService.login($scope.user)
            .success(function (data) {
                $state.go('dashboard');
            })
            .error(function (data) {
                $rootScope.updateErrorMessage(data.Message);
            })
            .finally(function () {
                loadingService.stopLoading();
            });
        };

        $scope.logout = function () {
            loadingService.startLoading();
            $rootScope.updateErrorMessage(null);
            authorizationService.logout()
            .success(function (data) {
                $state.go('login');
            })
            .error(function (data) {
                $rootScope.updateErrorMessage(data.Message);
            })
            .finally(function () {
                loadingService.stopLoading();
            })
        };

        $scope.hasPermission = function (path) {
            return session.hasViewPermission(path);
        };
    }

    define(['app', 'auth/session', 'components/common/loading/loadingService'], function (app) {
        if (!loaded) {
            loaded = true;
            app.lazy.controller('AuthorizationController', AuthorizationController);
        };
    });
})();