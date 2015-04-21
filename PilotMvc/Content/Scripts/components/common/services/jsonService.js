(function () {
    var Svc = null;
    define(['app'], function (app) {
        if (Svc == null) {
            Svc = ['$http', 'ConfigApp', function ($http, ConfigApp) {
                return {
                    postData: function (url, data, success, error) {
                        $http.post(ConfigApp.getPath(url), data).success(success).error(error);
                    },
                    post: function (url, success, error) {
                        $http.post(ConfigApp.getPath(url)).success(success).error(error);
                    },
                };
            }];
            app.lazy.factory('JsonService', Svc);
        }
    });
})();