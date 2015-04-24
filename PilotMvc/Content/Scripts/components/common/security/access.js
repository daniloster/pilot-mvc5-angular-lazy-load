(function () {
    var loaded = false;
    define(['angular', 'app', 'auth/session'], function (angular, app, session) {
        if (!loaded) {
            app.lazy.decorator('ngDisabledDirective', ['ConfigApp', '$rootScope', '$location', function (configApp, $rootScope, $location) {
                return {
                    restrict: 'A',
                    scope: {
                        mustDisable: '=ngDisabled'
                    },
                    link: function ($scope, elem, attrs) {

                        $rootScope.$on('Access:validate', function (evt) {

                        });

                        var active = elem.attr('href');

                        elem.on('click', function () {
                            check($('[nav-check]'), active);
                        });

                        checkItem($(elem), $location.path());
                    }
                };
            }]);
            loaded = true;
        }
    });
})();