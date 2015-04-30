(function () {
    var Controller = null;
    define(['angular', 'app', 'components/common/loading/loadingController', 'app/membership/membershipService'],
    function (angular, app, loadingController) {
        if (Controller === null) {
            Controller = ['$scope', '$rootScope', '$location', '$q', 'MembershipService',
            function ($scope, $rootScope, $location, $q,membershipService) {

                $scope.onCancel = function () {
                    $scope.member = null;
                    // $location.path('/login');
                    $rootScope.pageAction =  undefined;
                };

                $scope.register = function (member) {
                    if (!member || member.Password !== member.ConfirmPassword) {
                        return;
                    }

                    loadingController.startLoading();
                    membershipService.register(member, function (data) {
                        $scope.message = "You have been registered successfully!";
                        $scope.isSucceeded = true;
                        loadingController.stopLoading();
                        $location.path('/dashboard');
                    }, function (data) {
                        $scope.message = data.Message ? data.Message : "An Error has occured while saving the data! Please, contact the administrator!";
                        loadingController.stopLoading();
                    });
                };


                $scope.importAccount = function (culturefoxMember) {
                    var deferred = $q.defer();
                    loadingController.startLoading();
                    membershipService.importAccount(culturefoxMember, function (data) {
                        $scope.member = data;
                        $scope.member.Password = $scope.member.ConfirmPassword = culturefoxMember.Password;
                        deferred.resolve(true);
                        loadingController.stopLoading();
                    }, function (data) {
                        deferred.resolve(false);
                        $scope.message = data.Message ? data.Message : "An Error has occured while saving the data! Please, contact the administrator!";
                        loadingController.stopLoading();
                    });
                    return deferred.promise;
                };

            }];
            app.lazy.controller('MembershipController', Controller);
        }
    });
})();