(function () {
    var loaded = false;
    define(['angular', 'app', 'components/common/loading/loadingController', 'auth/authorizationController', 'components/common/navMenu/navCheck'], function (angular, app) {
        if (!loaded) {
            app.lazy.directive("menu", ['ConfigApp', function (ConfigApp) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/app/navMenu/style.css')));
                return {
                    replace: true,
                    restrict: 'EA',
                    templateUrl: ConfigApp.getPath('/Content/Scripts/components/app/navMenu/template.html')
                };
            }]);
            loaded = true;
        }
    });
})();