(function () {
    var loaded = false;
    define(['angular', 'app', 'components/common/loading/loadingController'], function (angular, app) {
        if (!loaded) {
            app.lazy.directive("loading", ['ConfigApp', function (ConfigApp) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/App/components/common/loading/style.css')));
                return {
                    controller: "LoadingController",
                    restrict: 'EA',
                    templateUrl: ConfigApp.getPath('/Content/App/components/common/loading/template.html')
                };
            }]);
            loaded = true;
        }
    });
})();