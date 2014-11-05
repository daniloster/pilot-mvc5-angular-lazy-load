define(['angular', 'app', 'domReady', 'util'], function (angular, app, domReady) {
    angular.element(document).ready(function () {
        angular.bootstrap(document, [app['name']]);
    });
});