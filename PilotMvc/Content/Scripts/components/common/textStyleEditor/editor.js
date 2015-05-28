(function () {
    var loaded = false;
    define(['app', 'jq', 'angular', 'bootstrap', 'components/common/textStyleEditor/textStyleEditorController', 'components/common/colorPicker/picker'], function (app, $, angular) {
        if (!loaded) {

            app.lazy.directive("textStyleEditor", ['ConfigApp', function (ConfigApp) {
                angular.element('body').after(angular.element('<link href="' + ConfigApp.getPath('/Content/Scripts/components/common/textStyleEditor/style.css') + '" type="text/css" rel="stylesheet" />'));

                return {
                    replace: false,
                    controller: "TextStyleEditorController",
                    restrict: 'EA',
                    templateUrl: ConfigApp.getPath('/Content/Scripts/components/common/textStyleEditor/template.html'),
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