(function () {
    var Controller = null;
    define(['angular', 'app', 'components/common/loading/loadingController', 'app/usuario/usuarioService'],
    function (angular, app, loadingController) {
        if (Controller === null) {
            Controller = ['$scope', '$rootScope', '$location', '$q', '$filter', 'UsuarioService',
            function ($scope, $rootScope, $location, $q, $filter, usuarioService) {
                var search = $filter('filter');

                $scope.usuarios = [];

                $scope.paginador = {
                    items: function () {
                        return search(!!$scope.usuarios ? $scope.usuarios : [], $scope.search);
                    },
                    itemsPerPage: 8,
                    currentPage:1
                };

                loadingController.clear();

                $scope.getAll = function () {
                    loadingController.startLoading();
                    usuarioService.query(function (data) {
                        $scope.usuarios = data;
                        loadingController.stopLoading();
                    }, function () {
                        $scope.usuarios = [];
                        $scope.erro = data.Message;
                        loadingController.stopLoading();
                    });
                };


                $scope.editar = function (id) {
                    $scope.usuario = null;
                    $scope.erro = null;
                    $scope.sucesso = null;
                    loadingController.startLoading();
                    usuarioService.get({id: id}, function (data) {
                        $scope.usuario = data;
                        loadingController.stopLoading();
                    }, function () {
                        $scope.erro = data.Message;
                        loadingController.stopLoading();
                    });
                };

                $scope.novo = function () {
                    $scope.erro = null;
                    $scope.sucesso = null;
                    $scope.usuario = null;
                };

                $scope.salvar = function () {
                    var deferred = $q.defer();

                    if (!!$scope.usuario) {
                        var action = null;
                        if (!!$scope.usuario.Id) {
                            action = usuarioService.save;
                        } else {
                            action = usuarioService.register; 
                        }

                        deferred.promise.then(function (success) {
                            if (success) {
                                $scope.getAll();
                            }
                        });

                        loadingController.startLoading();

                        action($scope.usuario, function (data) {
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

                $scope.confirmarDelete = function (usuarioSelecionado) {
                    $scope.usuarioSelecionado = usuarioSelecionado;
                };

                $scope.delete = function () {
                    var deferred = $q.defer();
                    loadingController.startLoading();
                    usuarioService.delete({ id: $scope.usuarioSelecionado.Id }, function (data) {
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

                $scope.gerarSenha = function () {
                    var text = "";
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                    for (var i = 0; i < 8; i++){
                        text += possible.charAt(Math.floor(Math.random() * possible.length));
                    }
                    
                    $scope.usuario.Senha = text;
                };

                $scope.getAll();
            }];
            app.lazy.controller('UsuarioController', Controller);
        }
    });
})();