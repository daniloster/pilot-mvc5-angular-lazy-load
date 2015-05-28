(function () {
    var loaded = false;
    define(['angular', 'app', 'components/common/loading/loadingController', 'auth/authorizationController', 'components/common/navMenu/navCheck'], function (angular, app) {
        if (!loaded) {
            app.lazy.directive("menu", ['ConfigApp', function (configApp) {
                angular.element('body').after(angular.element('<link href="' + configApp.getPath('/Content/Scripts/components/app/navMenu/style.css') + '" type="text/css" rel="stylesheet" />'));
                return {
                    replace: true,
                    restrict: 'EA',
                    templateUrl: configApp.getPath('/Content/Scripts/components/app/navMenu/template.html')
                };
            }]);
            loaded = true;
        }
    });
})();