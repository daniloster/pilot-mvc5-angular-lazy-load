(function () {
    var loaded = false;
    define(['angular', 'app'], function (angular, app) {
        if (!loaded) {
            app.lazy.directive("customValidation", ['ConfigApp', function (ConfigApp) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/form/customValidation.css')));
                return {
                    restrict: 'A',
                    require: 'ngModel',
                    link: function (scope, elem, attrs, ngModel) {
                        elem.addClass('custom-validation');
                        //For model -> DOM validation
                        ngModel.$formatters.unshift(function (value) {
                            /*
                            @type validity: [<Object>{<String name>, <Boolan isValid>, <Object formattedValue>}]
                            */
                            var validations = scope[attrs.customValidation], formattedValue = undefined;
                            validations.forEach(function (validity) {
                                ngModel.$setValidity(validity.name, validity.isValid(value));
                                if (formattedValue == undefined) {
                                    formattedValue = (validity.formattedValue || function () { return undefined; })(value);
                                }
                            });
                            
                            return (formattedValue || value);
                        });
                    }
                };
            }]);
            loaded = true;
        }
    });
})();
