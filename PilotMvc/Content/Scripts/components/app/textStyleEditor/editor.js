(function () {
    var loaded = false;
    define(['app', 'jquery', 'angular', 'bootstrap', 'components/app/textStyleEditor/textStyleEditorController', 'components/common/colorPicker/picker'], function (app, $, angular) {
        if (!loaded) {

            app.lazy.directive("textStyleEditor", ['ConfigApp', function (ConfigApp) {
                angular.element('body').after(angular.element('<link href="' + ConfigApp.getPath('/Content/Scripts/components/app/textStyleEditor/style.css') + '" type="text/css" rel="stylesheet" />'));

                return {
                    replace: false,
                    controller: "TextStyleEditorController",
                    restrict: 'E',
                    templateUrl: ConfigApp.getPath('/Content/Scripts/components/app/textStyleEditor/template.html'),
                    scope: {
                        editorId: '@',
                        title: '@',
                        onConfirmEditing: '&?',
                        onCancelEditing: '&?'
                    }
                };
            }]);

            loaded = true;
        }
    });
})();