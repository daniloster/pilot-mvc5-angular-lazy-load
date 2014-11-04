(function () {
    var HomeCtrl = null, idx = 0;
    define(['app', 'app/member/memberSvc'], function (app, memberSvc) {
        if (HomeCtrl == null) {
            HomeCtrl = ['$scope', 'app.member.memberSvc', function ($scope, memberSvc) {
                var messages = ["This is the home controller", "Welcome to home controller", "It is a new attempt"];
                $scope.message = messages[idx];

                $scope.changeWelcome = function () {
                    $scope.message = messages[(idx = ((++idx) % 3))];
                };

                $scope.getListExample = function () {
                    memberSvc.test(
                        { LastName: "Castro" },
                        function (data) {
                            console.log(data);
                        },
                        function (data) {
                            console.log(data);
                        });
                };
            }];

            app.lazy.controller('app.home.homeCtrl', HomeCtrl);
        };
    });
})();