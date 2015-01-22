define(['angular', 'app', 'util'], function (angular, app) {
    angular.element(document).ready(function () {
        angular.bootstrap(document, [app['name']]);
    });
});