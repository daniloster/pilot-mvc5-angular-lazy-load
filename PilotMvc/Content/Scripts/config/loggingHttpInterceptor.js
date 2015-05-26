(function () {
    var loaded = false;
    define(['app'], function (app) {
        if (!loaded) {
            
            // Intercept http calls.
            app.lazy.factory('LoggingHttpInterceptor', ['$q', function ($q) {
                return {
                    // On request success
                    request: function (config) {
                        config = config || $q.when(config);
                        //// console.log(config); // Contains the data about the request before it is sent.
                        //config.headers.Accept = "application/json, text/plain, text/html, */*";
                        console.log('@request: ', config);
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
                        console.log('@response: ', response);
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