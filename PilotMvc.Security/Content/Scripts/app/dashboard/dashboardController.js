(function () {
    var Ctrl = null, idx = 0;
    define(['app', 'components/common/loading/loadingController', 'app/dashboard/dashboardService'], function (app, loadingController) {
        if (Ctrl == null) {
            Ctrl = ['$scope', '$filter', 'DashboardService', function ($scope, $filter, dashboardService) {
                loadingController.startLoading();
                dashboardService.getStats(function (data) {
                    $scope.stats = data;
                    loadingController.stopLoading();
                }, function (data) {
                    $scope.stats = {};
                    loadingController.stopLoading();
                });
            }];

            app.lazy.controller('DashboardController', Ctrl);
        };
    });
})();