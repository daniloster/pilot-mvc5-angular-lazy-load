(function () {
    var loaded = false;
    define(['angular', 'app', 'components/pagination/paginationController'], function (angular, app) {
        if (!loaded) {
            app.filter('offset', function () {
                return function (input, start) {
                    start = parseInt(start, 10);
                    if (!!input)
                        return input.slice(start);
                };
            });
            app.filter('page', [function () {
                return function (input, page, size) {
                    var start = (page - 1) * size;
                    start = parseInt(start, 10);
                    var limitTo = page * size;
                    limitTo = parseInt(limitTo, 10);
                    if (!!input)
                        return input.slice(start, limitTo);
                };
            }]);
            app.lazy.directive("pagination", ['ConfigApp', function (configApp) {
                angular.element('body').after(angular.element('<link href="' + configApp.getPath('/Content/Scripts/components/pagination/style.css') + '" type="text/css" rel="stylesheet" />'));
                return {
                    controller: "PaginationController",
                    restrict: 'E',
                    scope: {
                        pager: '='
                    },
                    templateUrl: configApp.getPath('/Content/Scripts/components/pagination/template.html')
                };
            }]);
            loaded = true;
        }
    });
})();