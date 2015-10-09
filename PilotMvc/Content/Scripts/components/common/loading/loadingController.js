(function () {
    var Ctrl = null;
    define(['app', 'components/common/loading/loadingManager'], function (app) {
        if (Ctrl == null) {
            Ctrl = ['$scope', 'LoadingManager', function ($scope, loadingManager) {

                $scope.isLoading = function () {
                    return instance.isLoading();
                };

                $scope.hasOverlay = function () {
                    return instance.hasOverlay();
                };
            }];

            app.lazy.controller('LoadingController', Ctrl);
        }

        return instance;
    });
})();