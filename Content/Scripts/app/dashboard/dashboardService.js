(function() {
    var Svc = null;
    define(['app'], function (app) {
        if (Svc == null) {
            Svc = ['$http', 'ConfigApp', function ($http, ConfigApp) {

                var resource = {
                    getQuantidadeSistemas: function (success, error) {
                        $http.post('/dashboard/get-quantidade-sistemas').success(success).error(error);
                    },

                    getQuantidadeObjetos: function (success, error) {
                        $http.post('/dashboard/get-quantidade-objetos').success(success).error(error);
                    },

                    getQuantidadePerfis: function (success, error) {
                        $http.post('/dashboard/get-quantidade-perfis').success(success).error(error);
                    },

                    getQuantidadeUsuarios: function (success, error) {
                        $http.post('/dashboard/get-quantidade-usuarios').success(success).error(error);
                    }
                };
                
                return resource;
            }];
            app.lazy.factory('DashboardService', Svc);
        }
    });
})();