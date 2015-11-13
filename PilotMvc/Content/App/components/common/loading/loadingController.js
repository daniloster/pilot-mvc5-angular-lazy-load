(function () {
    var Ctrl = ['$scope', 'LoadingManager', function ($scope, loadingManager) {

        $scope.isLoading = function () {
            return loadingManager.isLoading();
        };

        $scope.hasOverlay = function () {
            return loadingManager.hasOverlay();
        };
    }], loaded = false;
    define(['app', 'components/common/loading/loadingManager'], function (app) {
        if (!loaded) {
            loaded = true;
            app.lazy.controller('LoadingController', Ctrl);
        }
    });
})();