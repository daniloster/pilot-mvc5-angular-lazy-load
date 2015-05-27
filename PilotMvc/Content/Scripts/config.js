(function () {
    define(['app', 'routes', 'config/loggingHttpInterceptor', 'config/configApp', 'auth/authorizationService'], function (app, routes) {

        app.config(['$routeProvider', '$locationProvider', '$controllerProvider', '$provide', '$filterProvider', '$compileProvider', '$animateProvider', '$httpProvider', '$sceDelegateProvider', 'ConfigApp',
        function ($routeProvider, $locationProvider, $controllerProvider, $provide, $filterProvider, $compileProvider, $animateProvider, $httpProvider, $sceDelegateProvider, ConfigApp) {

            app.lazy = {
                controller: $controllerProvider.register,
                factory: $provide.factory,
                service: $provide.service,
                filter: $filterProvider.register,
                directive: $compileProvider.directive,
                constant: $provide.constant,
                animation: $animateProvider.register,
                value: $provide.value
            };

            // Just allow animation on elements that has the class 'angular-animate'
            $animateProvider.classNameFilter(/angular-animate/);

            // Add the interceptor to the $httpProvider.
            $httpProvider.interceptors.push('LoggingHttpInterceptor');

            $sceDelegateProvider.resourceUrlWhitelist([
                // Allow same origin resource loads.
                'self',
                // Allow loading from our assets domain.  Notice the difference between * and **.
                ConfigApp.getPath('/**')
            ]);
            // The blacklist overrides the whitelist so the open redirect here is blocked.
            $sceDelegateProvider.resourceUrlBlacklist([]);

            $httpProvider.defaults.useXDomain = true;
            //Remove the header used to identify ajax call  that would prevent CORS from working
            delete $httpProvider.defaults.headers.common['X-Requested-With'];

            if (appSettings.handleRoutes) {
                routes($routeProvider);

                $locationProvider.html5Mode({
                    enabled: true,
                    requireBase: false
                });
            }
        }]);

    });
})();