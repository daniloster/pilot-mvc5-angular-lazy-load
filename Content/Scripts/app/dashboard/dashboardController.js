(function () {
    var Controller = null;
    define(['angular', 'app', 'components/common/loading/loadingController', 'app/dashboard/dashboardService'],
    function (angular, app, loadingController) {
        if (Controller === null) {
            Controller = ['$scope', '$rootScope', '$location', '$q', 'DashboardService',
            function ($scope, $rootScope, $location, $q,dashboardService) {
                dashboardService.getQuantidadeSistemas(function (data) {
                    $scope.quantidadeSistemas = data;
                }, function () {
                    $scope.erro = data.Message;
                });
                dashboardService.getQuantidadeObjetos(function (data) {
                    $scope.quantidadeObjetos = data;
                }, function () {
                    $scope.erro = data.Message;
                });
                dashboardService.getQuantidadePerfis(function (data) {
                    $scope.quantidadePerfis = data;
                }, function () {
                    $scope.erro = data.Message;
                });
                dashboardService.getQuantidadeUsuarios(function (data) {
                    $scope.quantidadeUsuarios = data;
                }, function () {
                    $scope.erro = data.Message;
                });

            }];
            app.lazy.controller('DashboardController', Controller);
        }
    });
})();