(function () {
    var loaded = false;
    define(['angular', 'app', 'components/common/remotePagination/remotePaginationController'], function (angular, app) {
        if (!loaded) {
            app.lazy.directive("remotePagination", ['ConfigApp', function (ConfigApp) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/remotePagination/style.css')));
                return {
                    controller: "RemotePaginationController",
                    restrict: 'EA',
                    scope: {
                        list: '=',
                        pageSize: '=',
                        currentPage: '=',
                        filter: '=',
                        restUrl: '=',
                        type: '@'
                    },
                    templateUrl: ConfigApp.getPath('/Content/Scripts/components/common/remotePagination/template.html')
                };
            }]);
            loaded = true;
        }
    });
})();