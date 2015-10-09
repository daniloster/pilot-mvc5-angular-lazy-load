(function () {
    var Ctrl = null;
    define(['app', 'components/common/loading/loadingManager', 'app/shared/access/optionsService'], function (app) {
        if (Ctrl === null) {
            Ctrl = ['$scope', '$rootScope', '$q', 'OptionsService', 'LoadingManager', function ($scope, $rootScope, $q, optionsService, loadingManager) {
                
            }];
            app.lazy.controller('UserBasedAssignmentController', Ctrl);
        }
    });
})();