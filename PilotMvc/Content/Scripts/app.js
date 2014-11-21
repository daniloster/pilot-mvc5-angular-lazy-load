(function () {
    'use strict';
    var app = null;
    define(['angular', 'resolve', 'auth/roles', 'auth/session', 'jquery', 'ngRoute', 'ngResource', 'ngMocks', 'ngCookies', 'ngAnimate', 'ngSanitize'], function (angular, resolve, roles, session) {
        if (app === null) {
            app = angular.module('pilotApp', ['ngRoute', 'ngResource', 'ngCookies']);

            app.lazy = {
                controller: app.controller,
                factory: app.factory,
                service: app.service,
                filter: app.filter,
                directive: app.directive
            };

            app.lazy.factory('authorizationSvc',
            ['$http', '$cookieStore', function ($http, $cookieStore) {

                var resource = {
                    login: function (user, success, error) {
                        $http.post('/user/login', user).success(function (data) {
                            session.init($cookieStore, data);
                            success(data);
                        }).error(function (data) {
                            session.clear($cookieStore);
                            error(data);
                        });
                    },
                    logout: function (success, error) {
                        try {
                            session.clear($cookieStore);
                            success();
                        } catch (e) {
                            error(e);
                        }
                    },
                    getCurrent: function (success, error) {
                        $http.post('/user/current').success(success).error(error);
                    }
                };

                return resource;
            }]);

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
                    .when("/", { templateUrl: '/partials/home', resolve: resolve(['app/home/homeCtrl'], [roles.Admin, roles.Member, roles.Guest]) })
                    .when("/not-authorized", { templateUrl: '/partials/not-authorized' })
                    .when("/login", { templateUrl: '/partials/login', resolve: resolve(['auth/userCtrl']) })
                    .when("/404", { templateUrl: '/partials/404' })
                    .when("/member", { templateUrl: '/partials/member', resolve: resolve(['app/member/memberCtrl'], [roles.Admin, roles.Member]) })
                    .when("/contact", { templateUrl: '/partials/contact', resolve: resolve(['app/contact/contactCtrl'], [roles.Admin, roles.Member]) })
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