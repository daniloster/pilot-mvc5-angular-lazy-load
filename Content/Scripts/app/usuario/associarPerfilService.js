(function() {
    var Svc = null;
    define(['app'], function (app) {
        if (Svc == null) {
            Svc = ['$http', 'ConfigApp', function ($http, ConfigApp) {

                var resource = {
                    getPerfis: function (data, success, error) {
                        $http.post('/associar-perfil/get-perfis', data).success(success).error(error);
                    },

                    getUsuario: function (data, success, error) {
                        $http.post('/associar-perfil/get-usuario', data).success(success).error(error);
                    },

                    save: function (data, success, error) {
                        $http.post('/associar-perfil/save', data).success(success).error(error);
                    }
                };
                
                return resource;
            }];
            app.lazy.factory('AssociarPerfilService', Svc);
        }
    });
})();