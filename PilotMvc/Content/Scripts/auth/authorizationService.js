(function () {
    var Svc = null;
    define(['app', 'auth/session', 'config/configApp'], function (app, session) {
        if (Svc == null) {
            Svc = ['$http', 'ConfigApp', function ($http, ConfigApp) {

                var resource = {
                    login: function (user, success, error) {
                        $http.post(ConfigApp.getPath('/user/login'), user).success(function (data) {
                            session.init(data);
                            success(data);
                        }).error(function (data) {
                            session.clear();
                            error(data);
                        });
                    },
                    logout: function (success, error) {
                        $http.post(ConfigApp.getPath('/user/logout')).success(function (data) {
                            try {
                                session.clear();
                            } catch (e) { }
                            success();
                        }).error(function (data) {
                            error(data);
                        });
                    },
                    getCurrent: function (success, error) {
                        $http.post(ConfigApp.getPath('/user/current')).success(success).error(error);
                    }
                };

                return resource;
            }];

            app.lazy.factory('AuthorizationService', Svc);
        };
    });
})();