(function () {
    var loaded = false, instance = null, hasLoads = [], overlay = false;
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

    function LoadingServiceFactory() {
        return instance;
    }

    define(['app'], function (app) {
        if (!loaded) {
            loaded = true;
            app.lazy.factory('LoadingService', LoadingServiceFactory);
        }
    });
})();