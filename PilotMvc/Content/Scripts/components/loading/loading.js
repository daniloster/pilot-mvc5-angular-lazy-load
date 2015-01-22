(function () {
    var loaded = false;
    define(['angular', 'app', 'components/loading/loadingController'], function (angular, app) {
        if (!loaded) {
            app.lazy.directive("loading", ['ConfigApp', function (configApp) {
                angular.element('body').after(angular.element('<link href="' + configApp.getPath('/Content/Scripts/components/loading/style.css') + '" type="text/css" rel="stylesheet" />'));
                return {
                    controller: "LoadingController",
                    restrict: 'E',
                    templateUrl: configApp.getPath('/Content/Scripts/components/loading/template.html')
                };
            }]);
            loaded = true;
        }
    });
})();