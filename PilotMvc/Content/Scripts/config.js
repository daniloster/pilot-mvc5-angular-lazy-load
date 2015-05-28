(function () {
    define(['app', 'routes', 'config/loggingHttpInterceptor', 'config/configApp', 'auth/authorizationService'], function (app, routes) {

        app.config(['$routeProvider', '$locationProvider', '$controllerProvider', '$provide', '$filterProvider', '$compileProvider', '$animateProvider', '$httpProvider', '$sceDelegateProvider', 'ConfigApp',
        function ($routeProvider, $locationProvider, $controllerProvider, $provide, $filterProvider, $compileProvider, $animateProvider, $httpProvider, $sceDelegateProvider, ConfigApp) {
            // Recreating the registers for each kind of object, it ensure that, when a script 
            // is load after the application has started, it will bee registered. Knowing 
            // that app.controller / app.factory / and the other methods are unassigned after 
            // load app.
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
                // Eg: www.clientwebsite.com/**
                // It must be the domain that is using the CORS Web Component, once I can use the 
                // same config file for an Single Page Application or a CORS Web Component.
                ConfigApp.getPath('/**') 
            ]);
            // The blacklist overrides the whitelist so the open redirect here is blocked.
            $sceDelegateProvider.resourceUrlBlacklist([]);

            //Setting use of CORS
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