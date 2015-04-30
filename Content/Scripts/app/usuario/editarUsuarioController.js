(function () {
    var Controller = null;
    define(['angular', 'app', 'components/common/loading/loadingController', 'app/usuario/usuarioService'],
    function (angular, app, loadingController) {
        if (Controller === null) {
            Controller = ['$scope', '$rootScope', 'UsuarioService', 'AuthorizationService',
            function ($scope, $rootScope, usuarioService, authorizationService) {
                
                loadingController.clear();
                $scope.erro = null;
                $scope.sucesso = null;

                loadingController.startLoading();
                authorizationService.getCurrent(function (data) {
                    $scope.usuario = data;
                    loadingController.stopLoading();
                }, function () {
                    $scope.erro = data.Message;
                    loadingController.stopLoading();
                });

                $scope.salvar = function () {
                    loadingController.startLoading();
                    usuarioService.editarUsuarioLogado($scope.usuario, function (data) {
                        $scope.sucesso = data.Message;
                        loadingController.stopLoading();
                    }, function () {
                        $scope.erro = data.Message;
                        loadingController.stopLoading();
                    });
                };

                $scope.alterarSenha = function () {
                    loadingController.startLoading();
                    usuarioService.alterarSenha({ id: $scope.usuario.Id , senha: $scope.password}, function (data) {
                        $scope.sucesso = data.Message;
                        loadingController.stopLoading();
                    }, function () {
                        $scope.erro = data.Message;
                        loadingController.stopLoading();
                    });
                }
            }];
            app.lazy.controller('EditarUsuarioController', Controller);
        }
    });
})();