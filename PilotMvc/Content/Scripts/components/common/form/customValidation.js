(function () {
    var loaded = false;
    define(['angular', 'app'], function (angular, app) {
        if (!loaded) {
            app.lazy.directive("customValidation", ['ConfigApp', function (ConfigApp) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/form/customValidation.css')));
                return {
                    restrict: 'A',
                    require: 'ngModel',
                    link: function ($scope, elem, attrs, ngModel) {
                        //Detecting changes for settings
                        $scope.$watch(attrs.customValidation, function (nval, oval) {
                            if (nval == oval) return;
                            validations = nval;
                            refreshTriggers();
                            validationHandler(ngModel.$viewValue);
                        });

                        elem.addClass('custom-validation');

                        var validations = $scope[attrs.customValidation],
                            validationHandler = function (value, dispatchedBy) {
                                /*
                                @type validity: [<Object>{<String name>, <Boolan isValid>, <Object formattedValue>, notifiers:[<Object>]}]
                                */
                                var formattedValue = undefined;
                                validations.forEach(function (validity) {
                                    if (!dispatchedBy || !validity.triggers || validity.triggers.filter(function (item) { return item == dispatchedBy; }).length) {
                                        ngModel.$setValidity(validity.name, validity.isValid(value));
                                        if (formattedValue == undefined) {
                                            formattedValue = (validity.formattedValue || function () { return undefined; })(value);
                                        }
                                    }
                                });

                                return (formattedValue || value);
                            },
                            triggers = [],
                            refreshTriggers = function () {
                                validations.forEach(function (validation) {
                                    if (!!validation.triggers && !!validation.triggers.length) {
                                        validation.triggers.forEach(function (trigger) {
                                            if (triggers.filter(function (item) { return item == trigger; }).length == 0) {
                                                triggers.push(trigger);
                                                $scope.$watch(trigger, function (nval, oval) {
                                                    if (nval == oval) return;
                                                    validationHandler(ngModel.$viewValue, trigger);
                                                });
                                            }
                                        });
                                    }
                                });
                            };
                        //Init triggers
                        refreshTriggers();
                        
                        //For DOM validation -> model
                        ngModel.$parsers.unshift(function (value) {
                            return validationHandler(value);
                        });

                        validationHandler(isNaN(ngModel.$modelValue) ? undefined : ngModel.$modelValue);
                    }
                };
            }]);
            loaded = true;
        }
    });
})();
