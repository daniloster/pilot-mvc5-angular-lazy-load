define(['angular', 'app', 'domReady', 'util', 'auth/userCtrl'], function (angular, app, domReady) {
    angular.element(document).ready(function () {
        try {
            angular.bootstrap(document, [app['name']]);
        } catch (e) { location.href = '/'; }
    });
});