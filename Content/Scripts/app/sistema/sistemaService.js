(function() {
    var Svc = null;
    define(['app'], function (app) {
        if (Svc == null) {
            Svc = ['$http', 'ConfigApp', function ($http, ConfigApp) {

                var resource = {
                    query: function (success, error) {
                        $http.post('/sistema/all').success(success).error(error);
                    },

                    get: function (data, success, error) {
                        $http.post('/sistema/get', data).success(success).error(error);
                    },

                    'delete': function (data, success, error) {
                        $http.post('/sistema/delete', data).success(success).error(error);
                    },

                    save: function (data, success, error) {
                        $http.post('/sistema/save', data).success(success).error(error);
                    },

                    criar: function (data, success, error) {
                        $http.post('/sistema/criar', data).success(success).error(error);
                    }
                };
                
                return resource;
            }];
            app.lazy.factory('SistemaService', Svc);
        }
    });
})();