(function () {
    var Controller = null;
    define(['angular', 'app', 'components/common/loading/loadingController', 'app/perfil/associarObjetoService'],
    function (angular, app, loadingController) {
        if (Controller === null) {
            Controller = ['$scope', '$rootScope', '$location', '$routeParams', 'AssociarObjetoService',
            function ($scope, $rootScope, $location, $routeParams, associarObjetoService) {

                $scope.perfilId = $routeParams.perfilId;

                loadingController.clear();

                $scope.adicionar = function (obj, index) {
                    $scope.erro = null;
                    $scope.sucesso = null;
                    if (obj.Removido == undefined) {
                        obj.Adicionado = true;
                    } else {
                        obj.Removido = false;
                    }

                    $scope.objetosDisponiveis.splice(index, 1);
                    $scope.objetosSelecionados.push(obj);
                };

                $scope.remover = function (obj, index) {
                    $scope.erro = null;
                    $scope.sucesso = null;
                    if (obj.Adicionado == undefined) {
                        obj.Removido = true;
                    } else {
                        obj.Adicionado = false;
                    }

                    $scope.objetosSelecionados.splice(index, 1);
                    $scope.objetosDisponiveis.push(obj);
                };

                $scope.salvar = function () {
                    loadingController.startLoading();
                    var args = {
                        id: $scope.perfilId,
                        idsObjetos: $scope.objetosSelecionados.map(function (item) { return item.Id; })
                    };
                    associarObjetoService.save(args, function (data) {
                        $scope.sucesso = data.Message;
                        loadingController.stopLoading();
                    }, function () {
                        $scope.erro = data.Message;
                        loadingController.stopLoading();
                    });
                };

                $scope.erro = null;
                $scope.sucesso = null;
                loadingController.startLoading();
                associarObjetoService.getPerfil({ id: $scope.perfilId }, function (data) {
                    $scope.perfil = data;
                    loadingController.startLoading();
                    associarObjetoService.getObjetos({ id: $scope.perfilId }, function (data) {
                        $scope.objetosSelecionados = data.Associados;
                        $scope.objetosDisponiveis = data.Disponiveis;
                        loadingController.stopLoading();
                    }, function () {
                        $scope.objetosSelecionados = [];
                        $scope.objetosDisponiveis = [];
                        $scope.erro = data.Message;
                        loadingController.stopLoading();
                    });
                    loadingController.stopLoading();
                }, function () {
                    $scope.erro = data.Message;
                    loadingController.stopLoading();
                });
            }];
            app.lazy.controller('AssociarObjetoController', Controller);
        }
    });
})();