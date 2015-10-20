(function () {
    var Svc = null;
    define(['app'], function (app) {
        if (Svc == null) {
            Svc = ['$http', 'ConfigApp', function ($http, ConfigApp) {
                return {
                    postData: function (url, data) {
                        return $http.post(ConfigApp.getPath(url), data);
                    },
                    post: function (url) {
                        return $http.post(ConfigApp.getPath(url));
                    },
                };
            }];
            app.lazy.factory('JsonService', Svc);
        }
    });
})();