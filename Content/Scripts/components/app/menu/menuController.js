(function () {
    var Ctrl = null;
    define(['app'], function (app) {
        if (Ctrl == null) {
            Ctrl = ['$scope', '$location', function ($scope, $location) {
                $scope.isActive = function (viewLocation) {
                    return viewLocation === $location.path();
                };
            }];

            app.lazy.controller('MenuController', Ctrl);
        };
    });
})();