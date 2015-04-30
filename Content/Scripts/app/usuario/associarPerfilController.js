(function () {
    var Controller = null;
    define(['angular', 'app', 'components/common/loading/loadingController', 'app/usuario/associarPerfilService', 'app/sistema/sistemaService'],
    function (angular, app, loadingController) {
        if (Controller === null) {
            Controller = ['$scope', '$rootScope', '$location', '$routeParams', 'AssociarPerfilService', 'SistemaService',
            function ($scope, $rootScope, $location, $routeParams, associarPerfilService, sistemaService) {

                $scope.usuarioId = $routeParams.usuarioId;

                loadingController.clear();

                $scope.carregarPerfis = function () {
                    $scope.erro = null;
                    $scope.sucesso = null;
                    if (!!$scope.sistemaId) {
                        loadingController.startLoading();
                        associarPerfilService.getPerfis({ idUsuario: $scope.usuarioId, idSistema: $scope.sistemaId }, function (data) {
                            $scope.perfisSelecionados = data.Associados;
                            $scope.perfisDisponiveis = data.Disponiveis;
                            loadingController.stopLoading();
                        }, function () {
                            $scope.perfisSelecionados = [];
                            $scope.perfisDisponiveis = [];
                            $scope.erro = data.Message;
                            loadingController.stopLoading();
                        });
                    }
                }

                $scope.adicionar = function (obj, index) {
                    $scope.erro = null;
                    $scope.sucesso = null;
                    if (obj.Removido == undefined) {
                        obj.Adicionado = true;
                    } else {
                        obj.Removido = false;
                    }

                    $scope.perfisDisponiveis.splice(index, 1);
                    $scope.perfisSelecionados.push(obj);
                };

                $scope.remover = function (obj, index) {
                    $scope.erro = null;
                    $scope.sucesso = null;
                    if (obj.Adicionado == undefined) {
                        obj.Removido = true;
                    } else {
                        obj.Adicionado = false;
                    }

                    $scope.perfisSelecionados.splice(index, 1);
                    $scope.perfisDisponiveis.push(obj);
                };

                $scope.salvar = function () {
                    loadingController.startLoading();
                    var args = {
                        idUsuario: $scope.usuarioId,
                        idSistema: $scope.sistemaId,
                        idsPerfis: $scope.perfisSelecionados.map(function (item) { return item.Id; })
                    };
                    associarPerfilService.save(args, function (data) {
                        $scope.sucesso = data.Message;
                        loadingController.stopLoading();
                    }, function () {
                        $scope.erro = data.Message;
                        loadingController.stopLoading();
                    });
                };

                loadingController.startLoading();
                loadingController.startLoading();
                $scope.erro = null;
                $scope.sucesso = null;
                associarPerfilService.getUsuario({ id: $scope.usuarioId }, function (data) {
                    $scope.usuario = data;
                    loadingController.stopLoading();
                }, function () {
                    $scope.erro = data.Message;
                    loadingController.stopLoading();
                });
                sistemaService.query(function (data) {
                    $scope.sistemas = data;
                    loadingController.stopLoading();
                }, function () {
                    $scope.erro = data.Message;
                    loadingController.stopLoading();
                });
            }];
            app.lazy.controller('AssociarPerfilController', Controller);
        }
    });
})();