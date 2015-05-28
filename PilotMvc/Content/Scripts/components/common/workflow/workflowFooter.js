(function () {
    var loaded = false;
    define(['app', 'components/app/workflow/workflowFooterController'], function (app) {
        if (!loaded) {
            app.lazy.directive("workflowFooter", ['ConfigApp', function (ConfigApp) {
                return {
                    replace: true,
                    restrict: 'EA',
                    controller: 'WorkflowFooterController',
                    templateUrl: ConfigApp.getPath('/Content/Scripts/components/app/workflow/footer.html')
                };
            }]);
            loaded = true;
        }
    });
})();