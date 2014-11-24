(function () {
    var loaded = false;
    define(['app', 'components/loading/loadingCtrl'], function (app) {
        if (!loaded) {
            app.lazy.directive("loading", function () {
                return {
                    restrict: 'E',
                    templateUrl: '/Content/Scripts/components/loading/template.html'
                };
            });
            loaded = true;
        }
    });
})();