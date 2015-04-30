(function () {
    var Ctrl = null, notificationsChecker = null;
    define(['app', 'auth/session', 'components/common/loading/loadingController'], function (app, session, loadingController) {
        if (Ctrl == null) {
            Ctrl = ['$rootScope', '$scope', '$cookieStore', '$location', '$interval', 'AuthorizationService',
            function ($rootScope, $scope, $cookieStore, $location, $interval, authorizationService) {
                if (notificationsChecker == null) {
                    notificationsChecker = function () {
                        /// implement function to check new notifications
                    };
                    $interval(notificationsChecker, 30 * 1000); // 30 seconds
                    $interval(function () {
                        $scope.$broadcast('User:refreshProfile', session.getUserLogged());
                    }, 1 * 1000); // 1 second
                }

                $scope.$on('User:refreshProfile', function (evt, arg) {
                    $rootScope.myProfile = arg;
                });

                $scope.login = function () {
                    loadingController.startLoading();
                    authorizationService.login($scope.user, function (data) {
                        loadingController.stopLoading();
                        $location.path('/');
                    }, function (data) {
                        $scope.message = data.Message;
                        loadingController.stopLoading();
                    })
                };

                $scope.logout = function () {
                    loadingController.startLoading();
                    authorizationService.logout(function (data) {
                        $rootScope.myProfile = null;
                        loadingController.stopLoading();
                        $location.path('/login');
                    }, function (data) {
                        $scope.message = data.Message;
                        loadingController.stopLoading();
                    })
                };

                $scope.isLogged = function () {
                    return $rootScope.myProfile != null;
                };

                if (!session.isLogged()) {
                    authorizationService.getCurrent(function (data) {
                        if (session.init($cookieStore, data)) {
                            $rootScope.myProfile = session.getUserLogged();
                        }
                    }, function () { });
                }

            }];

            app.lazy.controller('UserController', Ctrl);
        };
    });
})();