(function () {
    var loaded = false;
    define(['app'], function (app) {
        if (!loaded) {
            app.lazy.directive("pageFooter", ['ConfigApp', function (ConfigApp) {
                return {
                    replace: true,
                    restrict: 'E',
                    templateUrl: ConfigApp.getPath('/Content/Scripts/components/app/footer/template.html')
                };
            }]);
            loaded = true;
        }
    });
})();