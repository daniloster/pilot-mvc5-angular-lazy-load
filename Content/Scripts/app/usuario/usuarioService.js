(function() {
    var Svc = null;
    define(['app'], function (app) {
        if (Svc == null) {
            Svc = ['$http', 'ConfigApp', function ($http, ConfigApp) {

                var resource = {
                    query: function (success, error) {
                        $http.post('/usuario/all').success(success).error(error);
                    },

                    get: function (data, success, error) {
                        $http.post('/usuario/get', data).success(success).error(error);
                    },

                    register: function (data, success, error) {
                        $http.post('/usuario/register', data).success(success).error(error);
                    },

                    'delete': function (data, success, error) {
                        $http.post('/usuario/delete', data).success(success).error(error);
                    },

                    save: function (data, success, error) {
                        $http.post('/usuario/save', data).success(success).error(error);
                    },

                    editarUsuarioLogado: function (data, success, error) {
                        $http.post('/usuario/editar-usuario-logado', data).success(success).error(error);
                    },

                    alterarSenha: function (data, success, error) {
                        $http.post('/usuario/alterar-senha', data).success(success).error(error);
                    }
                };
                
                return resource;
            }];
            app.lazy.factory('UsuarioService', Svc);
        }
    });
})();