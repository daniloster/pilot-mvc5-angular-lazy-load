(function () {
    var Ctrl = null;
    define(['app', 'components/pagination/paginationDct'], function (app) {
        if (Ctrl == null) {
            Ctrl = ['$scope', function ($scope) {
                var pagination = null;
                $scope.init = function (property, value) {
                    pagination = value;
                    $scope.$watch('$parent.' + property, function (nval, oval) {
                        pagination = nval;
                    });
                };

                $scope.$watch('newCurrentPage', function (nval, oval) {
                    if (nval == oval) return;
                    if (!!pagination && !!pagination.currentPage && !!nval && nval > -1 && nval <= $scope.pageCount()) {
                        pagination.currentPage = nval;
                    }
                });

                $scope.firstPage = function () {
                    if ($scope.isInitialized()) {
                        pagination.currentPage = 1;
                    }
                };

                $scope.prevPage = function () {
                    if ($scope.isInitialized() && pagination.currentPage > 1) {
                        pagination.currentPage--;
                    }
                };

                $scope.prevPageDisabled = function () {
                    return !$scope.isInitialized() || pagination.currentPage <= 1 ? "disabled" : "";
                };

                $scope.pageCount = function () {
                    if ($scope.isInitialized()) {
                        return Math.ceil(pagination.items().length / pagination.itemsPerPage);
                    } else {
                        return 0;
                    }
                };

                $scope.nextPage = function () {
                    if ($scope.isInitialized() && pagination.currentPage < $scope.pageCount()) {
                        pagination.currentPage++;
                    }
                };

                $scope.lastPage = function () {
                    if ($scope.isInitialized()) {
                        pagination.currentPage = $scope.pageCount();
                    }
                };

                $scope.nextPageDisabled = function () {
                    return !$scope.isInitialized() || pagination.currentPage === $scope.pageCount() ? "disabled" : "";
                };

                $scope.isInitialized = function () {
                    return !!pagination && pagination.currentPage > 0;
                };

                $scope.$parent.$emit('paginationRequireInit', $scope.init);
            }];

            app.lazy.controller('paginationCtrl', Ctrl);
        };
    });
})();