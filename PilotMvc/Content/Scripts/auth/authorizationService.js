(function () {
    var Svc = null;
    define(['app', 'auth/session', 'config/configApp'], function (app) {
        if (Svc == null) {
            Svc = ['$http', 'ConfigApp', 'Session', function ($http, ConfigApp, session) {

                var resource = {
                    login: function (user, success, error) {
                        return $http.post(ConfigApp.getPath('/user/login'), user).success(function (data) {
                            session.init(data);
                            (success || function () { })(data);
                        });
                    },
                    logout: function (success, error) {
                        return $http.post(ConfigApp.getPath('/user/logout')).success(function (data) {
                            try {
                                session.clear();
                            } catch (e) { }
                        });
                    },
                    getCurrent: function (success, error) {
                        return $http.post(ConfigApp.getPath('/user/current'));
                    }
                };

                return resource;
            }];

            app.lazy.factory('AuthorizationService', Svc);
        };
    });
})();