(function () {
    var Ctrl = null;
    define(['app', 'components/common/loading/loadingController', 'app/shared/access/optionsService'], function (app, loadingCtrl) {
        if (Ctrl === null) {
            Ctrl = ['$scope', '$rootScope', '$q', 'OptionsService', function ($scope, $rootScope, $q, optionsService) {
                loadingCtrl.clear(false);



                $scope.search();
            }];
            app.lazy.controller('UserBasedAssignmentController', Ctrl);
        }
    });
})();