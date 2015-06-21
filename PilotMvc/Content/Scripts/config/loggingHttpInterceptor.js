(function () {
    var loaded = false;
    define(['app', 'config/configApp'], function (app) {
        if (!loaded) {
            
            // Intercept http calls.
            app.lazy.factory('LoggingHttpInterceptor', ['$q', 'ConfigApp', function ($q, ConfigApp) {
                return {
                    // On request success
                    request: function (config) {
                        config = config || $q.when(config);
                        config.url = ConfigApp.getNoCachePath(config.url);
                        //// console.log(config); // Contains the data about the request before it is sent.
                        //config.headers.Accept = "application/json, text/plain, text/html, */*";
                        if (appSettings.debug) {
                            console.log('@request: ', config);
                        }
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
                        // console.log(response); // Contains the data from the response.
                        if (appSettings.debug) {
                            console.log('@response: ', response);
                        }
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