(function () {
    define(['routes'], function (routes) {
        return function (app) {

            app.lazy = {
                controller: app.controller,
                provider: app.provider,
                factory: app.factory,
                service: app.service,
                filter: app.filter,
                directive: app.directive,
                constant: app.constant,
                animation: app.animation,
                decorator: app.decorator,
                value: app.value
            };

            app.config(['$routeProvider', '$locationProvider', '$controllerProvider', '$provide', '$filterProvider', '$compileProvider', '$animateProvider', '$httpProvider', '$sceDelegateProvider',
            function ($routeProvider, $locationProvider, $controllerProvider, $provide, $filterProvider, $compileProvider, $animateProvider, $httpProvider, $sceDelegateProvider) {
                app.lazy = {
                    controller: $controllerProvider.register,
                    provider: $provide.provider,
                    factory: $provide.factory,
                    service: $provide.service,
                    filter: $filterProvider.register,
                    directive: $compileProvider.directive,
                    constant: $provide.constant,
                    animation: $animateProvider.register,
                    decorator: $provide.decorator,
                    value: $provide.value
                };

                $sceDelegateProvider.resourceUrlWhitelist([
                    // Allow same origin resource loads.
                    'self',
                    // Allow loading from our assets domain.  Notice the difference between * and **.
                    'http://m12014.one365.com/**'
                ]);

                // The blacklist overrides the whitelist so the open redirect here is blocked.
                $sceDelegateProvider.resourceUrlBlacklist([]);

                $httpProvider.defaults.useXDomain = true;
                //Remove the header used to identify ajax call  that would prevent CORS from working
                delete $httpProvider.defaults.headers.common['X-Requested-With'];

                routes($routeProvider);

                $locationProvider.html5Mode({
                    enabled: true,
                    requireBase: false
                });
            }]);
        };
    });
})();