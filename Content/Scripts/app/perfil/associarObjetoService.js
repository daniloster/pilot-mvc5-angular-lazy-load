(function() {
    var Svc = null;
    define(['app'], function (app) {
        if (Svc == null) {
            Svc = ['$http', 'ConfigApp', function ($http, ConfigApp) {

                var resource = {
                    getObjetos: function (data, success, error) {
                        $http.post('/associar-objeto/get-objetos', data).success(success).error(error);
                    },

                    getPerfil: function (data, success, error) {
                        $http.post('/associar-objeto/get-perfil', data).success(success).error(error);
                    },

                    save: function (data, success, error) {
                        $http.post('/associar-objeto/save', data).success(success).error(error);
                    }
                };
                
                return resource;
            }];
            app.lazy.factory('AssociarObjetoService', Svc);
        }
    });
})();