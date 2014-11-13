(function () {
    var loaded = false;
    define(['app'], function (app) {
        if (!loaded) {
            app.lazy.directive("pagination", function () {
                return {
                    restrict: 'E',
                    templateUrl: '/Content/Scripts/components/pagination/template.html'
                };
            });
            loaded = true;
        }
    });
})();