(function () {
    var Controller = null;
    define(['angular', 'app', 'components/common/loading/loadingController', 'app/objeto/objetoService', 'app/sistema/sistemaService'],
    function (angular, app, loadingController) {
        if (Controller === null) {
            Controller = ['$scope', '$rootScope', '$location', '$q', '$filter', 'ObjetoService', 'SistemaService',
            function ($scope, $rootScope, $location, $q, $filter, objetoService, sistemaService) {
                var search = $filter('filter');

                $scope.objetos = [];

                $scope.paginador = {
                    items: function () {
                        return search(!!$scope.objetos ? $scope.objetos : [], $scope.search);
                    },
                    itemsPerPage: 8,
                    currentPage:1
                };

                loadingController.clear();

                loadingController.startLoading();
                objetoService.getTipos(function (data) {
                    $scope.tiposObjeto = data;
                    loadingController.stopLoading();
                }, function(data){
                    $scope.erro = data.Message;
                    loadingController.stopLoading();
                });

                $scope.getAll = function () {
                    loadingController.startLoading();
                    objetoService.query(function (data) {
                        $scope.objetos = data;
                        loadingController.stopLoading();
                    }, function () {
                        $scope.objetos = [];
                        $scope.erro = data.Message;
                        loadingController.stopLoading();
                    });
                };


                $scope.editar = function (id) {
                    $scope.objeto = null;
                    $scope.erro = null;
                    $scope.sucesso = null;
                    loadingController.startLoading();
                    sistemaService.query(function (data) {
                        $scope.sistemas = data;
                        loadingController.stopLoading();
                    }, function () {
                        $scope.erro = data.Message;
                        loadingController.stopLoading();
                    });
                    objetoService.get({ id: id }, function (data) {
                        $scope.objeto = data;
                        loadingController.stopLoading();
                    }, function () {
                        $scope.erro = data.Message;
                        loadingController.stopLoading();
                    });
                };

                $scope.novo = function () {
                    $scope.erro = null;
                    $scope.sucesso = null;
                    if ($scope.objeto) {
                        $scope.objeto.Id = null;
                        $scope.objeto.Valor = null;
                        $scope.objeto.Descricao = null;
                    }
                    loadingController.startLoading();
                    sistemaService.query(function (data) {
                        $scope.sistemas = data;
                        loadingController.stopLoading();
                    }, function () {
                        $scope.erro = data.Message;
                        loadingController.stopLoading();
                    });
                };

                $scope.salvar = function () {
                    var deferred = $q.defer();

                    if (!!$scope.objeto) {
                        var action = null;
                        if (!!$scope.objeto.Id) {
                            action = objetoService.save;
                        } else {
                            action = objetoService.criar;
                        }

                        deferred.promise.then(function (success) {
                            if (success) {
                                $scope.getAll();
                            }
                        });

                        loadingController.startLoading();

                        action($scope.objeto, function (data) {
                            $scope.sucesso = data.Message;
                            deferred.resolve(true);
                            loadingController.stopLoading();
                        }, function (data) {
                            $scope.erro = data.Message;
                            deferred.resolve(false);
                            loadingController.stopLoading();
                        });

                    } else {
                        deferred.resolve(false);
                    }

                    return deferred.promise;
                };

                $scope.confirmarDelete = function (objetoSelecionado) {
                    $scope.erro = null;
                    $scope.sucesso = null;
                    $scope.objetoSelecionado = objetoSelecionado;
                };

                $scope.delete = function () {
                    var deferred = $q.defer();
                    loadingController.startLoading();
                    objetoService.delete({ id: $scope.objetoSelecionado.Id }, function (data) {
                        $scope.sucesso = data.Message;
                        $scope.getAll();
                        deferred.resolve(true);
                        loadingController.stopLoading();
                    }, function (data) {
                        $scope.erro = data.Message;
                        deferred.resolve(false);
                        loadingController.stopLoading();
                    });
                    return deferred.promise;
                };

                $scope.getAll();
            }];
            app.lazy.controller('ObjetoController', Controller);
        }
    });
})();