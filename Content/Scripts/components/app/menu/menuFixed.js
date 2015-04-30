(function () {
    var loaded = false;
    define(['app', 'auth/userController', 'components/app/menu/menuController'], function (app) {
        if (!loaded) {
            app.lazy.directive("menuFixed", ['ConfigApp', function (ConfigApp) {
                return {
                    replace: true,
                    restrict: 'E',
                    templateUrl: ConfigApp.getPath('/Content/Scripts/components/app/menu/template.html'),
                    link: function (scope, elem, attrs) {
                        var css = '<link type="text/css" rel="stylesheet" href="' + ConfigApp.getPath('/Content/Scripts/components/app/menu/style.css') + '" />';
                        elem.append(css);
                    }
                };
            }]);
            loaded = true;
        }
    });
})();