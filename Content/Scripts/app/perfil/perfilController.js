(function () {
    var Controller = null;
    define(['angular', 'app', 'components/common/loading/loadingController', 'app/perfil/perfilService', 'app/sistema/sistemaService'],
    function (angular, app, loadingController) {
        if (Controller === null) {
            Controller = ['$scope', '$rootScope', '$location', '$q', '$filter', 'PerfilService', 'SistemaService',
            function ($scope, $rootScope, $location, $q, $filter, perfilService, sistemaService) {
                var search = $filter('filter');

                $scope.perfis = [];

                $scope.paginador = {
                    items: function () {
                        return search(!!$scope.perfis ? $scope.perfis : [], $scope.search);
                    },
                    itemsPerPage: 8,
                    currentPage:1
                };

                loadingController.clear();

                $scope.getAll = function () {
                    loadingController.startLoading();
                    perfilService.query(function (data) {
                        $scope.perfis = data;
                        loadingController.stopLoading();
                    }, function () {
                        $scope.perfis = [];
                        $scope.erro = data.Message;
                        loadingController.stopLoading();
                    });
                };


                $scope.editar = function (id) {
                    $scope.perfil = null;
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
                    perfilService.get({ id: id }, function (data) {
                        $scope.perfil = data;
                        loadingController.stopLoading();
                    }, function () {
                        $scope.erro = data.Message;
                        loadingController.stopLoading();
                    });
                };

                $scope.novo = function () {
                    $scope.erro = null;
                    $scope.sucesso = null;
                    $scope.perfil = null;
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

                    if (!!$scope.perfil) {
                        var action = null;
                        if (!!$scope.perfil.Id) {
                            action = perfilService.save;
                        } else {
                            action = perfilService.criar;
                        }

                        deferred.promise.then(function (success) {
                            if (success) {
                                $scope.getAll();
                            }
                        });

                        loadingController.startLoading();

                        action($scope.perfil, function (data) {
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

                $scope.confirmarDelete = function (perfilSelecionado) {
                    $scope.perfilSelecionado = perfilSelecionado;
                };

                $scope.delete = function () {
                    var deferred = $q.defer();
                    loadingController.startLoading();
                    perfilService.delete({ id: $scope.perfilSelecionado.Id }, function (data) {
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
            app.lazy.controller('PerfilController', Controller);
        }
    });
})();