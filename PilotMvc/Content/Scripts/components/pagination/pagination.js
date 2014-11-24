(function () {
    var loaded = false;
    define(['app', 'components/pagination/paginationCtrl'], function (app) {
        if (!loaded) {
            app.filter('offset', function () {
                return function (input, start) {
                    start = parseInt(start, 10);
                    if (!!input)
                        return input.slice(start);
                };
            });
            app.lazy.directive("pagination", function () {
                return {
                    restrict: 'E',
                    templateUrl: '/Content/Scripts/components/pagination/template.html'
                };
            });
            loaded = true;
        }
    });
})();