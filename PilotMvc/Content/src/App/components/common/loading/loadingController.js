(function () {
    var Ctrl = ['$scope', 'LoadingService', function ($scope, loadingService) {

        $scope.isLoading = function () {
            return loadingService.isLoading();
        };

        $scope.hasOverlay = function () {
            return loadingService.hasOverlay();
        };
    }], loaded = false;
    define(['app', 'components/common/loading/loadingService'], function (app) {
        if (!loaded) {
            loaded = true;
            app.lazy.controller('LoadingController', Ctrl);
        }
    });
})();