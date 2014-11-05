(function () {
    var Ctrl = null, idx = 0;
    define(['app'], function (app) {
        if (Ctrl == null) {
            Ctrl = ['$rootScope', '$scope', function ($rootScope, $scope) {
                // you can inject any instance here
                if (!$rootScope._loadPendings) {
                    $rootScope._loadPendings = 0;
                }
                window.startLoad = function () {
                    $rootScope._loadPendings++;
                };
                window.stopLoad = function () {
                    $rootScope._loadPendings--;
                };
                $rootScope.isLoading = function () {
                    $rootScope._loadPendings > 0;
                };
            }];

            app.lazy.controller('loadingCtrl', Ctrl);
        }
    });
})();