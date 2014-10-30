window.name = "NG_DEFER_BOOTSTRAP!";
define(['angular', 'app', 'domReady'], function (angular, app, domReady) {

    domReady(function () {
        app.init();
    });

    angular.bootstrap(document, [app['name']]);
});