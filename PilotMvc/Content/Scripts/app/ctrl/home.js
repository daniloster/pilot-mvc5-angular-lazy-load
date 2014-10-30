(function () {
    var HomeCtrl = null, idx = 0;
    define(['app'], function (app) {
        if (HomeCtrl == null) {
            HomeCtrl = ['$scope', function ($scope) {
                var messages = ["This is the home controller", "Welcome to home controller", "It is a new attempt"];
                $scope.message = messages[idx];

                $scope.changeWelcome = function () {
                    $scope.message = messages[(idx = ((++idx) % 3))];
                };
            }];

            HomeCtrl.name = 'HomeCtrl';
            app.lazy.controller(HomeCtrl.name, HomeCtrl);
        };
    });
})();