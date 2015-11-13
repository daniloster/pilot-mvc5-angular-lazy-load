(function () {
    var Ctrl = null;
    define(['app'], function (app) {
        if (Ctrl == null) {
            Ctrl = ['$scope', '$filter', '$timeout', function ($scope, $filter, $timeout) {
                if ($scope.inList == undefined) {
                    $scope.inList = [];
                }

                var search = $filter('filter'), paginator = $filter('pager'),
                    pageItems = function () {
                        var rest = 0, items = search(!!$scope.inList ? $scope.inList : [], !!$scope.searchQuery ? $scope.searchQuery : '');
                        if ($scope.currentPage != 1 && $scope.currentPage > (items.length / $scope.pageSize)) {
                            rest = (items.length % $scope.pageSize) > 0 ? 1 : 0;
                            $scope.currentPage = parseInt(items.length / $scope.pageSize) + rest;
                        }

                        return paginator(items, $scope.currentPage, $scope.pageSize).map(function (item) { return item; });
                    };

                $scope.$watch('inList', function (nval, oval) {
                    if (nval == oval) return;
                    $scope.outList = pageItems();
                });

                $scope.$watch('searchQuery', function (nval, oval) {
                    if (nval == oval) return;
                    $scope.outList = pageItems();
                });

                $scope.$watch('currentPage', function (nval, oval) {
                    if (nval == oval) return;
                    if (nval < 1 || nval > $scope.pageCount()) {
                        $scope.currentPage = oval;
                    }
                    $scope.outList = pageItems();
                });

                $scope.firstPage = function () {
                    if ($scope.isInitialized()) {
                        $scope.currentPage = 1;
                    }
                };

                $scope.prevPage = function () {
                    if ($scope.isInitialized() && $scope.currentPage > 1) {
                        $scope.currentPage--;
                    }
                };

                $scope.prevPageDisabled = function () {
                    return !$scope.isInitialized() || $scope.currentPage <= 1 ? "disabled" : "";
                };

                $scope.pageCount = function () {
                    if ($scope.isInitialized()) {
                        return Math.ceil($scope.inList.length / $scope.pageSize);
                    } else {
                        return 0;
                    }
                };

                $scope.isVisible = function () {
                    return $scope.pageCount() > 1;
                };

                $scope.nextPage = function () {
                    if ($scope.isInitialized() && $scope.currentPage < $scope.pageCount()) {
                        $scope.currentPage++;
                    }
                };

                $scope.lastPage = function () {
                    if ($scope.isInitialized()) {
                        $scope.currentPage = $scope.pageCount();
                    }
                };

                $scope.nextPageDisabled = function () {
                    return !$scope.isInitialized() || $scope.currentPage === $scope.pageCount() ? "disabled" : "";
                };

                $scope.totalItems = function () {
                    return $scope.isInitialized() ? $scope.inList.length : 0;
                };

                $scope.isInitialized = function () {
                    return $scope.inList != undefined && !!$scope.inList.length && $scope.currentPage > 0;
                };

                $scope.pageSize = !!$scope.pageSize ? $scope.pageSize : 10;
                $scope.currentPage = !!$scope.currentPage ? $scope.currentPage : 1;
                $scope.searchQuery = !!$scope.searchQuery ? $scope.searchQuery : '';
                $scope.type = !!$scope.type ? $scope.type : 'normal';
                $scope.outList = pageItems();

            }];

            app.lazy.controller('PaginationController', Ctrl);
        };
    });
})();