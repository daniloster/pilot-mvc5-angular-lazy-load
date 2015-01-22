(function () {
    var Ctrl = null;
    define(['app'], function (app) {
        if (Ctrl == null) {
            Ctrl = ['$scope', '$rootScope', '$location', 'AuthorizationService', function ($scope, $rootScope, $location, authorizationSvc) {
                $rootScope.title = "Login";
                $scope.login = function () {
                    authorizationSvc.login($scope.user, function (data) {
                        $location.path('/');
                    }, function (data) {
                        $scope.message = data.Message;
                    })
                };

                $scope.logout = function () {
                    authorizationSvc.logout(function (data) {
                        $location.path('/login');
                    }, function (data) {
                        $scope.message = data.Message;
                    })
                };
            }];

            app.lazy.controller('UserController', Ctrl);
        };
    });
})();