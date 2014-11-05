(function () {
    var HomeCtrl = null, idx = 0;
    define(['app', 'app/member/memberSvc'], function (app, memberSvc) {
        if (HomeCtrl == null) {
            HomeCtrl = ['$scope', '$filter', 'memberSvc', function ($scope, $filter, memberSvc) {
                var messages = ["This is the home controller", "Welcome to home controller", "It is a new attempt"];
                $scope.message = messages[idx];

                $scope.syncOpt = {
                    Id: 2,
                    Name: "Bla bla bla",
                    Desc: "Bla"
                };

                $scope.elements = [
                    {
                        Id: 1,
                        Name: "Bla bla bla"
                    },
                    {
                        Id: 2,
                        Name: "Bla 2"
                    },
                    {
                        Id: 3,
                        Name: "Bla 3"
                    }
                ];

                var find = Array.createFinder('Id');
                $scope.syncOpt = find($scope.elements, $scope.syncOpt.Id);

                $scope.isSelected = function (defined, option) {
                    return (!defined && !option) || (!!option && defined.Id == option.Id);
                };

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

                $scope.getListExample2 = function () {
                    memberSvc.test2(
                        { LastName: "Castro" },
                        function (data) {
                            console.log(data);
                            $scope.user = data;
                        },
                        function (data) {
                            console.log(data);
                        });
                };

                $scope.getListExample2();
            }];

            app.lazy.controller('homeCtrl', HomeCtrl);
        };
    });
})();