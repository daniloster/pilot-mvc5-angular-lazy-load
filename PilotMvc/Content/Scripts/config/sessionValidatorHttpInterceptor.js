(function () {
    var loaded = false, myTicket;
    define(['app', 'auth/session', 'config/configApp'], function (app) {
        if (!loaded) {

            function createTicket($timeout, $location, $rootScope, session) {
                myTicket = new Date();
                (function (timestamp) {

                    $timeout(function () {
                        $rootScope.$apply(function () {
                            if (timestamp === myTicket.getTime() && session.isLogged()) {
                                session.clear();
                                $rootScope.AuthorizedUser = null;
                                if ($location.path().indexOf('/mis/') > -1) {
                                    // Management system is redirected to login
                                    $location.path('/mis/login');
                                } else {
                                    // Whereas website is redirected to logout, cause we dont't have a login page there
                                    $location.path('/logout');
                                }
                            }
                        });
                    }, appSettings.sessionTimeout * 60 * 1000); // (appSettings.sessionTimeout) Minutes after

                })(myTicket.getTime());
            }

            // Intercept http calls.
            app.lazy.factory('SessionValidatorHttpInterceptor', ['$q', 'ConfigApp', '$location', '$timeout', '$rootScope', 'Session', function ($q, ConfigApp, $location, $timeout, $rootScope, session) {
                return {
                    // On request success
                    request: function (config) {
                        createTicket($timeout, $location, $rootScope, session);
                        config = config || $q.when(config);
                        // Return the config or wrap it in a promise if blank.
                        return config;
                    },

                    // On request failure
                    requestError: function (rejection) {
                        // console.log(rejection); // Contains the data about the error on the request.
                        // Return the promise rejection.
                        return $q.reject(rejection);
                    },

                    // On response success
                    response: function (response) {   
                        // Return the response or promise.
                        return response || $q.when(response);
                    },

                    // On response failture
                    responseError: function (rejection) {
                        // console.log(rejection); // Contains the data about the error.
                        // Return the promise rejection.
                        return $q.reject(rejection);
                    }
                };
            }]);

            loaded = true;
        }
    });
})();