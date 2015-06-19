(function () {
    var loaded = false;
    define(['angular', 'app'], function (angular, app) {
        if (!loaded) {
            function init(value, defaultValue) {
                return (!!value) ? value : defaultValue;
            }

            app.lazy.directive("pilotCheckbox", ['ConfigApp', function (ConfigApp) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/form/checkbox/style.css')));
                return {
                    restrict: 'EA',
                    scope: {
                        pilotCheckboxType: '@',
                        pilotCheckboxName: '@',
                        pilotCheckboxLabel: '@',
                        pilotCheckboxModel: '=?',
                        pilotCheckboxChecked: '&'
                    },
                    templateUrl: ConfigApp.getPath('/Content/Scripts/components/common/form/checkbox/template.html'),
                    link: function (scope, elem, attrs) {
                        scope.pilotCheckboxType = init(scope.pilotCheckboxType, 'info');
                        scope.pilotCheckboxName = init(scope.pilotCheckboxName, 'checkbox-' + new Date().getTime());
                        
                        elem.children('.checkbox').addClass('checkbox-' + scope.pilotCheckboxType);
                        var checkbox = elem.find('[type=checkbox]'), label = elem.find('label');
                        checkbox.attr('id', 'element-' + scope.pilotCheckboxName);
                        checkbox.attr('name', 'element-' + scope.pilotCheckboxName);
                        label.attr('for', 'element-' + scope.pilotCheckboxName);

                        //it means that is not defined
                        if (scope.pilotCheckboxChecked() === undefined) {
                            scope.isChecked = function () {
                                return scope.pilotCheckboxModel;
                            };
                        } else {
                            scope.isChecked = function () {
                                return scope.pilotCheckboxModel = scope.pilotCheckboxChecked();
                            };  
                        }
                    }
                };
            }]);
            loaded = true;
        }
    });
})();