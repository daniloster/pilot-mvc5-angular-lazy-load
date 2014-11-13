define(['angular', 'app', 'domReady', 'util'], function (angular, app, domReady) {
    angular.element(document).ready(function () {
        try {
            angular.bootstrap(document, [app['name']]);
        } catch (e) { location.href = '/'; }
    });
});