(function () {
    var Ctrl = null, idx = 0;
    define(['app', 'components/common/loading/loadingController', 'app/system/systemService'], function (app, loadingController) {
        if (Ctrl == null) {
            Ctrl = ['$scope', '$filter', 'SystemService', function ($scope, $filter, systemService) {
                loadingController.startLoading();
                systemService.getByFilter({}, function (data) {
                    $scope.stats = data;
                    loadingController.stopLoading();
                }, function (data) {
                    $scope.stats = {};
                    loadingController.stopLoading();
                });
            }];

            app.lazy.controller('SystemController', Ctrl);
        };
    });
})();