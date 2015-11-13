(function () {

    var app = null;
    define(['angular', 'ngRoute', 'ngResource', 'ngMocks', 'ngCookies', 'ngAnimate', 'ngSanitize', 'ngMessages'],
        function (angular) {
        if (app === null) {
            app = angular.module('pilotMvc', ['ngRoute', 'ngResource', 'ngCookies', 'ngSanitize', 'ngAnimate', 'ngMessages']);

            app.lazy = {
                provider: app.provider,
                controller: app.controller,
                factory: app.factory,
                service: app.service,
                filter: app.filter,
                directive: app.directive,
                constant: app.constant,
                animation: app.animation,
                value: app.value
            };
        }
        return app;
    });
})();