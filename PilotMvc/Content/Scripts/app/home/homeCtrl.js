(function () {
    var Ctrl = null, idx = 0;
    define(['app', 'app/home/homeSvc'], function (app) {
        if (Ctrl == null) {
            Ctrl = ['$scope', '$filter', 'homeSvc', function ($scope, $filter, homeSvc) {
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