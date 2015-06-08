(function () {
    var loaded = false;
    define(['angular', 'app', 'components/common/pagination/paginationController'], function (angular, app) {
        if (!loaded) {
            app.lazy.filter('offset', function () {
                return function (input, start) {
                    start = parseInt(start, 10);
                    if (!!input)
                        return input.slice(start);
                };
            });
            app.lazy.filter('pager', [function () {
                return function (input, page, size) {
                    var start = (page - 1) * size;
                    start = parseInt(start, 10);
                    var limitTo = page * size;
                    limitTo = parseInt(limitTo, 10);
                    if (!!input) {
                        return input.slice(start, limitTo);
                    }
                    return [];
                };
            }]);
            app.lazy.directive("pagination", ['ConfigApp', function (ConfigApp) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/pagination/style.css')));
                return {
                    controller: "PaginationController",
                    restrict: 'EA',
                    scope: {
                        inList: '=',
                        outList: '=',
                        pageSize: '=',
                        currentPage: '=',
                        searchQuery: '=',
                        type: '@'
                    },
                    templateUrl: ConfigApp.getPath('/Content/Scripts/components/common/pagination/template.html')
                };
            }]);
            loaded = true;
        }
    });
})();