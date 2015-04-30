(function () {
    var Controller = null;
    define(['angular', 'app', 'components/common/loading/loadingController', 'app/sistema/sistemaService'],
    function (angular, app, loadingController) {
        if (Controller === null) {
            Controller = ['$scope', '$rootScope', '$location', '$q', '$filter', 'SistemaService',
            function ($scope, $rootScope, $location, $q, $filter, sistemaService) {
                var search = $filter('filter');

                $scope.sistemas = [];

                $scope.paginador = {
                    items: function () {
                        return search(!!$scope.sistemas ? $scope.sistemas : [], $scope.search);
                    },
                    itemsPerPage: 8,
                    currentPage:1
                };

                loadingController.clear();

                $scope.getAll = function () {
                    loadingController.startLoading();
                    sistemaService.query(function (data) {
                        $scope.sistemas = data;
                        loadingController.stopLoading();
                    }, function () {
                        $scope.sistemas = [];
                        $scope.erro = data.Message;
                        loadingController.stopLoading();
                    });
                };


                $scope.editar = function (id) {
                    $scope.sistema = null;
                    $scope.erro = null;
                    $scope.sucesso = null;
                    loadingController.startLoading();
                    sistemaService.get({ id: id }, function (data) {
                        $scope.sistema = data;
                        loadingController.stopLoading();
                    }, function () {
                        $scope.erro = data.Message;
                        loadingController.stopLoading();
                    });
                };

                $scope.novo = function () {
                    $scope.erro = null;
                    $scope.sucesso = null;
                    $scope.sistema = null;
                };

                $scope.salvar = function () {
                    var deferred = $q.defer();

                    if (!!$scope.sistema) {
                        var action = null;
                        if (!!$scope.sistema.Id) {
                            action = sistemaService.save;
                        } else {
                            action = sistemaService.criar;
                        }

                        deferred.promise.then(function (success) {
                            if (success) {
                                $scope.getAll();
                            }
                        });

                        loadingController.startLoading();

                        action($scope.sistema, function (data) {
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

                $scope.confirmarDelete = function (sistemaSelecionado) {
                    $scope.sistemaSelecionado = sistemaSelecionado;
                };

                $scope.delete = function () {
                    var deferred = $q.defer();
                    loadingController.startLoading();
                    sistemaService.delete({ id: $scope.sistemaSelecionado.Id }, function (data) {
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
            app.lazy.controller('SistemaController', Controller);
        }
    });
})();