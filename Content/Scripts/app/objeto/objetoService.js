(function() {
    var Svc = null;
    define(['app'], function (app) {
        if (Svc == null) {
            Svc = ['$http', 'ConfigApp', function ($http, ConfigApp) {

                var resource = {
                    query: function (success, error) {
                        $http.post('/objeto/all').success(success).error(error);
                    },

                    get: function (data, success, error) {
                        $http.post('/objeto/get', data).success(success).error(error);
                    },

                    'delete': function (data, success, error) {
                        $http.post('/objeto/delete', data).success(success).error(error);
                    },

                    save: function (data, success, error) {
                        $http.post('/objeto/save', data).success(success).error(error);
                    },

                    criar: function (data, success, error) {
                        $http.post('/objeto/criar', data).success(success).error(error);
                    },

                    getTipos: function (success, error) {
                        $http.post('/objeto/get-tipos').success(success).error(error);
                    }
                };
                
                return resource;
            }];
            app.lazy.factory('ObjetoService', Svc);
        }
    });
})();