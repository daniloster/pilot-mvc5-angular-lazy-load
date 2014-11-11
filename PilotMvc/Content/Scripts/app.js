(function () {
    'use strict';
    var app = null;
    define(['angular', 'resolveDependencies', 'domReady'], function (angular, resolve, domReady) {
        if (app === null) {
            app = angular.module('pilotApp', ['ngRoute', 'ngResource']);

            app.config(['$routeProvider', '$locationProvider', '$controllerProvider', '$provide', '$filterProvider', '$compileProvider',
            function ($routeProvider, $locationProvider, $controllerProvider, $provide, $filterProvider, $compileProvider) {
                /*app.lazy = {
                    controller: $controllerProvider.register,
                    directive: $compileProvider.directive,
                    filter: $filterProvider.register,
                    factory: $provide.factory,
                    service: $provide.service,
                    animation: $animationProvider.register
                };*/

                app.lazy = {
                    controller: $controllerProvider.register,
                    factory: $provide.factory,
                    service: $provide.service,
                    filter: $filterProvider.register,
                    directive: $compileProvider.directive
                };

                $routeProvider
                    .when("/", { templateUrl: '/partials/home', resolve: resolve(['app/home/homeCtrl']) })
                    .when("/404", { templateUrl: '/partials/404' })
                    .when("/member", { templateUrl: '/partials/member', resolve: resolve(['app/member/memberCtrl']) })
                    .when("/contact", { templateUrl: '/partials/contact', resolve: resolve(['app/contact/contactCtrl']) })
                    .otherwise({ redirectTo: '/404' });

                $locationProvider.html5Mode({
                    enabled: true,
                    requireBase: false
                });
            }]);
        }
        return app;
    });
})();