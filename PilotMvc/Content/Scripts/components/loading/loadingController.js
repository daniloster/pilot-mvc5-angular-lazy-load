(function () {
    var Ctrl = null, instance = null, 
        hasLoads = [], overlay = false;
    define(['app'], function (app) {
        if (Ctrl == null) {

            instance = {
                clear: function (hasOverlay) {
                    hasLoads = [];
                    overlay = !!hasOverlay;
                },
                isLoading: function () {
                    return hasLoads.length > 0;;
                },
                startLoading: function () {
                    hasLoads.push(1);
                },
                stopLoading: function () {
                    hasLoads.pop();
                },
                hasOverlay: function () {
                    return overlay;
                },
                enableOverlay: function () {
                    overlay = true;
                },
                disableOverlay: function () {
                    overlay = false;
                }
            };

            Ctrl = ['$scope', function ($scope) {

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