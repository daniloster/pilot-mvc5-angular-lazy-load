(function () {
    var Ctrl = null;
    define(['app'], function (app) {
        if (Ctrl == null) {
            Ctrl = ['$scope', function ($scope) {
                $scope.$watch('pager', function (nval, oval) {
                    if (nval == oval) return;
                    $scope.newCurrentPage = nval.currentPage;
                });
                
                $scope.$watch('newCurrentPage', function (nval, oval) {
                    if (nval == oval) return;
                    if (!!$scope.pager && !!$scope.pager.currentPage && !!nval && nval > -1 && nval <= $scope.pageCount()) {
                        $scope.pager.currentPage = nval;
                    } else {
                        $scope.newCurrentPage = oval;
                    }
                });

                $scope.firstPage = function () {
                    if ($scope.isInitialized()) {
                        $scope.pager.currentPage = 1;
                    }
                };

                $scope.prevPage = function () {
                    if ($scope.isInitialized() && $scope.pager.currentPage > 1) {
                        $scope.pager.currentPage--;
                    }
                };

                $scope.prevPageDisabled = function () {
                    return !$scope.isInitialized() || $scope.pager.currentPage <= 1 ? "disabled" : "";
                };

                $scope.pageCount = function () {
                    if ($scope.isInitialized()) {
                        return Math.ceil($scope.pager.items().length / $scope.pager.itemsPerPage);
                    } else {
                        return 0;
                    }
                };

                $scope.isVisible = function () {
                    return $scope.pageCount() > 1;
                };

                $scope.nextPage = function () {
                    if ($scope.isInitialized() && $scope.pager.currentPage < $scope.pageCount()) {
                        $scope.pager.currentPage++;
                    }
                };

                $scope.lastPage = function () {
                    if ($scope.isInitialized()) {
                        $scope.pager.currentPage = $scope.pageCount();
                    }
                };

                $scope.nextPageDisabled = function () {
                    return !$scope.isInitialized() || $scope.pager.currentPage === $scope.pageCount() ? "disabled" : "";
                };

                $scope.totalItems = function () {
                    return $scope.isInitialized() ? $scope.pager.items().length : 0;
                };

                $scope.isInitialized = function () {
                    return !!$scope.pager && $scope.pager.currentPage > 0;
                };

            }];

            app.lazy.controller('PaginationController', Ctrl);
        };
    });
})();