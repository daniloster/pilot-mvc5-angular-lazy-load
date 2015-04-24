(function () {
    var app = null;
    define(['angular', 'config', 'auth/session', 'lib/IE/isIE', 'jquery', 'ngRoute', 'ngResource', 'ngMocks', 'ngCookies', 'ngAnimate', 'ngSanitize'],
        function (angular, config, session, isIE) {
        if (app === null) {
            app = angular.module('componentExtension', ['ngRoute', 'ngResource', 'ngCookies', 'ngSanitize', 'ngAnimate']);

            config(app);

            var _base;
            try {
                _base = baseUrl || '';
            } catch (e) {
                _base = '';
            }

            app.lazy.constant('ConfigApp', {
                hasBaseUrl: !!_base,
                getPath: function (relativePath) {
                    return !!_base ? _base + relativePath : relativePath;
                }
            });

            app.lazy.factory('AuthorizationService',
            ['$http', '$cookieStore', 'ConfigApp', function ($http, $cookieStore, ConfigApp) {

                var resource = {
                    login: function (user, success, error) {
                        $http.post(ConfigApp.getPath('/user/login'), user).success(function (data) {
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
                        $http.post(ConfigApp.getPath('/user/current')).success(success).error(error);
                    }
                };

                return resource;
            }]);

           
          
        }
        return app;
    });
})();