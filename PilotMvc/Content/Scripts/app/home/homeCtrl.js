(function () {
    var Ctrl = null, idx = 0;
    define(['app', 'app/home/homeSvc'], function (app) {
        if (Ctrl == null) {
            Ctrl = ['$scope', '$rootScope', '$filter', 'homeSvc', function ($scope, $rootScope, $filter, homeSvc) {
                $rootScope.title = "Home";
                var messages = ["This is the home controller", "Welcome to home controller", "It is a new attempt"];
                $scope.message = messages[idx];

                $scope.changeWelcome = function () {
                    $scope.message = messages[(idx = ((++idx) % 3))];
                };
            }];

            app.lazy.controller('homeCtrl', Ctrl);
        };
    });
})();