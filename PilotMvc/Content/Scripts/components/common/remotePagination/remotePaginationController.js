(function () {
    var Ctrl = null;
    define(['app', 'components/common/loading/loadingController', 'components/common/services/jsonService'], function (app, loadingController) {
        if (Ctrl == null) {
            Ctrl = ['$scope', '$filter', '$timeout', 'JsonService', function ($scope, $filter, $timeout, jsonService) {
                
                $scope.$watch('currentPage', function (nval, oval) {
                    if (nval == oval) return;
                    if (nval < 1 || nval > $scope.pageCount) {
                        $scope.currentPage = oval;
                    } else {
                        $scope.$broadcast('RemotePagination:search', { pageIndex: $scope.currentPage });
                    }
                });

                var refresh = function () {
                    $scope.prevPageDisabled = !($scope.currentPage > 0);
                    $scope.isVisible = ($scope.pageCount > 1);
                    $scope.nextPageDisabled = ($scope.currentPage == $scope.pageCount);
                };

                $scope.firstPage = function () {
                    $scope.currentPage = 1;
                };

                $scope.prevPage = function () {
                    if ($scope.currentPage > 1) {
                        $scope.currentPage--;
                    }
                };

                $scope.nextPage = function () {
                    if ($scope.currentPage < $scope.pageCount) {
                        $scope.currentPage++;
                    }
                };

                $scope.lastPage = function () {
                    if (!!$scope.pageCount) {
                        $scope.currentPage = $scope.pageCount;
                    }
                };

                $scope.$on('RemotePagination:search', function (evtName, data) {
                    if (!!data && data.pageIndex == 1) {
                        $scope.currentPage = 1;
                    } else if (!!data && data.pageIndex > 1 && data.pageIndex <= $scope.pageCount) {
                        $scope.currentPage = data.pageIndex;
                    }

                    if (($scope.currentPage > 0) || (($scope.currentPage = 1) == 1)) {
                        $scope.search();
                    }
                });

                $scope.search = function () {
                    loadingController.startLoading();
                    $scope.filter = $scope.filter || {};
                    $scope.filter.Page = {
                        Number: $scope.currentPage,
                        Size: $scope.pageSize
                    };
                    jsonService.postData($scope.restUrl, $scope.filter, function (data) {
                        $scope.list = data.Data || [];
                        $scope.currentPage = data.Number || 1;
                        $scope.pageSize = data.Size || 1;
                        $scope.totalItems = data.TotalItems || 0;
                        $scope.pageCount = Math.ceil(data.TotalItems / parseFloat($scope.pageSize));
                        refresh();
                        loadingController.stopLoading();
                    }, function (data) {
                        $scope.list = [];
                        $scope.currentPage = 1;
                        $scope.pageSize = 1;
                        $scope.totalItems = 0;
                        $scope.pageCount = 0;
                        refresh();
                        loadingController.stopLoading();
                    });
                };

                if (!$scope.restUrl) {
                    throw new Error('You must provide an url for searching content.');
                }

                $scope.pageSize = $scope.pageSize || 10;
                $scope.currentPage = $scope.currentPage || 1;
                $scope.filter = $scope.filter || {};
                $scope.type = $scope.type || 'normal';

                $scope.$broadcast('RemotePagination:search', { pageIndex: $scope.currentPage });
            }];

            app.lazy.controller('RemotePaginationController', Ctrl);
        };
    });
})();