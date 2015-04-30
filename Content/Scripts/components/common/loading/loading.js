(function () {
    var loaded = false;
    define(['app', 'components/common/loading/loadingController'], function (app) {
        if (!loaded) {
            app.lazy.directive("loading", ['ConfigApp', function (ConfigApp) {
                angular.element('body').after(angular.element('<link href="' + ConfigApp.getPath('/Content/Scripts/components/common/loading/style.css') + '" type="text/css" rel="stylesheet" />'));
                return {
                    restrict: 'E',
                    templateUrl: ConfigApp.getPath('/Content/Scripts/components/common/loading/template.html'),
                    link:function($rootScope, elem, attrs) {
                        $rootScope.isLoaded = true;
                    }
                };
            }]);
            loaded = true;
        }
    });
})();