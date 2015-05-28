(function () {
    var loaded = false;
    define(['angular', 'app', 'components/common/loading/loadingController'], function (angular, app) {
        if (!loaded) {
            app.lazy.directive("loading", ['ConfigApp', function (configApp) {
                angular.element('body').after(angular.element('<link href="' + configApp.getPath('/Content/Scripts/components/common/loading/style.css') + '" type="text/css" rel="stylesheet" />'));
                return {
                    controller: "LoadingController",
                    restrict: 'EA',
                    templateUrl: configApp.getPath('/Content/Scripts/components/common/loading/template.html')
                };
            }]);
            loaded = true;
        }
    });
})();