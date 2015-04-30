(function () {
    var Ctrl = null, idx = 0;
    define(['app', 'components/common/loading/loadingController', 'app/home/homeService'], function (app, loadingCtrl) {
        if (Ctrl == null) {


            Ctrl = ['$scope', '$rootScope', '$filter', 'HomeService', function ($scope, $rootScope, $filter, homeSvc) {
                $rootScope.title = "Home";
                var messages = ["This is the home controller",
                    "Welcome to home controller",
                    "It is a new attempt"];
                $scope.message = messages[idx];

                $scope.changeWelcome = function () {
                    $scope.message = messages[(idx = ((++idx) % 3))];
                };

                $scope.login = function () {
                    homeSvc.login(function (data) {
                        alert('sucesso');
                    }, function (data) {
                        alert('erro');
                    });
                };
            }];



            app.lazy.controller('HomeController', Ctrl);




        };
    });
})();