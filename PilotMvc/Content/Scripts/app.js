﻿(function () {
    'use strict';
    var app = null;
    define(['angular', 'resolveDependencies', 'domReady'], function (angular, resolve, domReady) {
        if (app === null) {
            app = angular.module('pilotApp', ['ngRoute', 'ngResource']);
            
            app.init = function () {
                /* Solbing problem to integrate ASP.MVC with angularjs + requirejs */
                angular.resumeBootstrap([app['name']]);
            };

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
                    .when("", { })
                    .when("/home", { templateUrl: '/Partials/Home.html', resolve: resolve(['app/ctrl/home']) })
                    .when("/member", { templateUrl: '/Partials/Member.html', resolve: resolve(['app/ctrl/member']) })
                    .otherwise({ templateUrl: '/Partials/Home.html', resolve: resolve(['app/ctrl/home']) });
                //.otherwise({ redirectTo: '/' });
                $locationProvider.html5Mode({
                    enabled: true,
                    requireBase: false
                });
            }]);
        }
        return app;
    });
})();