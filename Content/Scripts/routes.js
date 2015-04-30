(function () {
    define(['routes', 'resolve', 'auth/roles'], function (routes, resolve, roles) {
        return function ($routeProvider) {

            $routeProvider
                    .when("/", {
                        templateUrl: '/Content/Partials/dashboard.html',
                        resolve: resolve(['app/dashboard/dashboardController'])
                    })

                    .when("/login", {
                        templateUrl: '/Content/Partials/login.html',
                        resolve: resolve(['auth/userController'])
                    })

                    .when("/not-authorized", { templateUrl: '/Content/Partials/not-authorized.html' })
                    .when("/404", { templateUrl: '/Content/Partials/404.html' })

                    .when("/usuario", {
                        templateUrl: '/Content/Partials/usuario.html',
                        resolve: resolve(['app/usuario/usuarioController'])
                    })
                    .when("/sistema", {
                        templateUrl: '/Content/Partials/sistema.html',
                        resolve: resolve(['app/sistema/sistemaController'])
                    })
                    .when("/perfil", {
                        templateUrl: '/Content/Partials/perfil.html',
                        resolve: resolve(['app/perfil/perfilController'])
                    })
                    .when("/objeto", {
                        templateUrl: '/Content/Partials/objeto.html',
                        resolve: resolve(['app/objeto/objetoController'])
                    })
                    .when("/associar-perfis/:usuarioId", {
                        templateUrl: '/Content/Partials/associar-perfis.html',
                        resolve: resolve(['app/usuario/associarPerfilController'])
                    })
                    .when("/associar-objetos/:perfilId", {
                        templateUrl: '/Content/Partials/associar-objetos.html',
                        resolve: resolve(['app/perfil/associarObjetoController'])
                    })
                    .when("/alterar-senha", {
                        templateUrl: '/Content/Partials/alterar-senha.html',
                        resolve: resolve(['app/usuario/editarUsuarioController'])
                    })
                    .when("/editar-dados-usuario", {
                        templateUrl: '/Content/Partials/editar-dados-usuario.html',
                        resolve: resolve(['app/usuario/editarUsuarioController'])
                    })
                    .otherwise({ redirectTo: '/404' });

        };
    });
})();