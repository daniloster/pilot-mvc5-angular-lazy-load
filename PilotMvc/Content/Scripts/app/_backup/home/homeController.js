(function () {
    var Ctrl = null, idx = 0;
    define(['app', 'components/common/loading/loadingController', 'app/home/homeService'], function (app, loadingCtrl) {
        if (Ctrl == null) {
            Ctrl = ['$scope', '$rootScope', '$filter', 'HomeService', function ($scope, $rootScope, $filter, homeSvc) {
                var messages = ["This is the home controller", "Welcome to home controller", "It is a new attempt"];
                $scope.message = messages[idx];

                $scope.changeWelcome = function () {
                    $scope.message = messages[(idx = ((++idx) % 3))];
                };
            }];

            app.lazy.controller('HomeController', Ctrl);
        };
    });
})();