(function () {
    var loaded = false;
    define(['angular', 'app'], function (angular, app) {
        if (!loaded) {
            app.lazy.directive("customValidation", ['ConfigApp', function (ConfigApp) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/form/customValidation.css')));
                return {
                    restrict: 'EA',
                    require: 'ngModel',
                    link: function (scope, elem, attrs, ngModel) {
                        //For model -> DOM validation
                        ngModel.$formatters.unshift(function (value) {
                            /*
                            @type validity: <Object>{<String name>, <Boolan isValid>, <Object formattedValue>}
                            */
                            var validity = scope[attrs.customValidation](value);
                            ngModel.$setValidity(validity.name, validity.isValid);
                            return (validity.formattedValue || value);
                        });
                    }
                };
            }]);
            loaded = true;
        }
    });
})();
