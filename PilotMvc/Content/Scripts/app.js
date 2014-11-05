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
                    .when("/", { templateUrl: '/Partials/Home.html', resolve: resolve(['app/home/homeCtrl']) })
                    .when("/member", { templateUrl: '/Partials/Member.html', resolve: resolve(['app/member/memberCtrl']) })
                    .otherwise({ redirectTo: '/' });

                $locationProvider.html5Mode({
                    enabled: true,
                    requireBase: false
                });
            }]);
        }
        return app;
    });
})();