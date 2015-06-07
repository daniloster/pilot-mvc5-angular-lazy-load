(function () {
    var Ctrl = null;
    define(['app'], function (app) {
        if (Ctrl == null) {
            Ctrl = ['$scope', '$rootScope', '$location', 'AuthorizationService', function ($scope, $rootScope, $location, authorizationSvc) {
                $scope.login = function () {
                    $scope.error = null;
                    $scope.user.rememberMe = !!$scope.user.rememberMe;
                    authorizationSvc.login($scope.user, function (data) {
                        $location.path('/');
                    }, function (data) {
                        $scope.error = data.Message;
                    })
                };

                $scope.logout = function () {
                    $scope.error = null;
                    authorizationSvc.logout(function (data) {
                        $location.path('/login');
                    }, function (data) {
                        $scope.error = data.Message;
                    })
                };
            }];

            app.lazy.controller('AuthorizationController', Ctrl);
        };
    });
})();