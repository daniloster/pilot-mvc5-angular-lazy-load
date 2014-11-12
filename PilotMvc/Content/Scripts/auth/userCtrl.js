(function () {
    var Ctrl = null;
    define(['app'], function (app) {
        if (Ctrl == null) {
            Ctrl = ['$scope', '$location', 'authorizationSvc', function ($scope, $location, authorizationSvc) {
                $scope.login = function () {
                    authorizationSvc.login($scope.user, function (data) {
                        $location.path('/home');
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

            app.lazy.controller('userCtrl', Ctrl);
        };
    });
})();