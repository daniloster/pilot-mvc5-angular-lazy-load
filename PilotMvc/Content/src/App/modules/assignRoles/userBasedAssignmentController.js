(function () {
    var Ctrl = null;
    define(['app', 'components/common/loading/loadingService', 'modules/shared/optionsService'], function (app) {
        if (Ctrl === null) {
            Ctrl = ['$scope', '$rootScope', '$q', 'OptionsService', 'LoadingService', function ($scope, $rootScope, $q, optionsService, loadingService) {
                
            }];
            app.lazy.controller('UserBasedAssignmentController', Ctrl);
        }
    });
})();