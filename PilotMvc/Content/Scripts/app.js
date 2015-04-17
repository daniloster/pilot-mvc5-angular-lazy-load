(function () {
    var app = null;
    define(['angular', 'resolve', 'auth/roles', 'auth/session', 'jquery', 'ngRoute', 'ngResource', 'ngMocks', 'ngCookies', 'ngAnimate', 'ngSanitize'], function (angular, resolve, roles, session) {
        if (app === null) {
            app = angular.module('pilotApp', ['ngRoute', 'ngResource', 'ngCookies']);

            app.lazy = {
                controller: app.controller,
                factory: app.factory,
                service: app.service,
                provider: app.provider,
                filter: app.filter,
                directive: app.directive,
                constant: app.constant
            };

            var _base = null;
            try { _base = baseUrl; } catch (e) { }
            app.lazy.constant('ConfigApp', {
                hasBaseUrl: !!_base,
                getPath: function (relativePath) {
                    return this.hasBaseUrl ? _base + relativePath : relativePath;
                }
            });

            app.lazy.factory('AuthorizationService',
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

            app.config(['$routeProvider', '$locationProvider', '$controllerProvider', '$provide', '$filterProvider', '$compileProvider', '$httpProvider',
            function ($routeProvider, $locationProvider, $controllerProvider, $provide, $filterProvider, $compileProvider, $httpProvider) {
                /*app.lazy = {
                    animation: $animationProvider.register
                };*/

                $httpProvider.defaults.useXDomain = true;
                //Remove the header used to identify ajax call  that would prevent CORS from working
                delete $httpProvider.defaults.headers.common['X-Requested-With'];

                app.lazy = {
                    controller: $controllerProvider.register,
                    factory: $provide.factory,
                    service: $provide.service,
                    provider: $provide.provider,
                    filter: $filterProvider.register,
                    directive: $compileProvider.directive,
                    constant: $provide.constant
                };

                $routeProvider
                    .when("/", { templateUrl: '/Content/Partials/home.html', resolve: resolve(['app/home/homeController'], [roles.Admin, roles.Member, roles.Guest]) })
                    .when("/not-authorized", { templateUrl: '/Content/Partials/not-authorized.html' })
                    .when("/login", { templateUrl: '/Content/Partials/login.html', resolve: resolve(['auth/userController']) })
                    .when("/404", { templateUrl: '/Content/Partials/404.html' })
                    .when("/member", { templateUrl: '/Content/Partials/member.html', resolve: resolve(['app/member/memberController'], [roles.Admin, roles.Member]) })
                    .when("/contact", { templateUrl: '/Content/Partials/contact.html', resolve: resolve(['app/contact/contactController', 'components/fileUpload/fileUpload'], [roles.Admin, roles.Member]) })
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