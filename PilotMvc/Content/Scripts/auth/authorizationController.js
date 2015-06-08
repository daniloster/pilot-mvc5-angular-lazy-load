(function () {
    var Ctrl = null;
    define(['app', 'components/common/loading/loadingController'], function (app, loadingController) {
        if (Ctrl == null) {
            Ctrl = ['$scope', '$rootScope', '$location', 'AuthorizationService', function ($scope, $rootScope, $location, authorizationSvc) {
                $scope.login = function () {
                    loadingController.startLoading();
                    $rootScope.updateErrorMessage(null);
                    $scope.user = $scope.user || {};
                    $scope.user.rememberMe = !!$scope.user.rememberMe;
                    authorizationSvc.login($scope.user, function (data) {
                        loadingController.stopLoading();
                        $location.path('/');
                    }, function (data) {
                        $rootScope.updateErrorMessage(data.Message);
                        loadingController.stopLoading();
                    })
                };

                $scope.logout = function () {
                    loadingController.startLoading();
                    $rootScope.updateErrorMessage(null);
                    authorizationSvc.logout(function (data) {
                        loadingController.stopLoading();
                        $location.path('/login');
                    }, function (data) {
                        $rootScope.updateErrorMessage(data.Message);
                        loadingController.stopLoading();
                    })
                };
            }];

            app.lazy.controller('AuthorizationController', Ctrl);
        };
    });
})();