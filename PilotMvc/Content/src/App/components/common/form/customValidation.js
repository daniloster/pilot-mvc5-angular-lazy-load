(function () {
    var loaded = false;
    define(['angular', 'app', 'components/common/form/customValidatorFactory'], function (angular, app) {
        if (!loaded) {
            var refreshTriggers = function (validationHandler, $scope, validations, triggers, ngRequiredParent) {
                (validations || []).forEach(function (validation) {
                    if (!!validation.triggers && !!validation.triggers.length) {
                        validation.triggers.forEach(function (trigger) {
                            if (triggers.filter(function (item) { return item == trigger; }).length == 0) {
                                triggers.push(trigger);
                                var notFirstAssignment = false;
                                $scope.$watch(trigger, function (nval, oval) {
                                    if (notFirstAssignment && nval == oval) return;
                                    notFirstAssignment = true;
                                    validationHandler(ngRequiredParent.$viewValue, trigger);
                                });
                            }
                        });
                    }
                });
            },
            getTarget = function (elem, target) {
                target = elem.attr('validation-highlight-target');
                if (target !== undefined) {
                    if ('@next' === target) {
                        target = elem.next();
                    } else if ('@prev' === target) {
                        target = elem.prev();
                    } else {
                        target = angular.element(target);
                    }
                    return target;
                }
                return undefined;
            },
            applyClassToTarget = function (elem, target) {
                if (target !== undefined) {
                    if (elem.hasClass('ng-invalid')) {
                        target.addClass('ng-invalid');
                        target.removeClass('ng-valid');
                    } else {
                        target.removeClass('ng-invalid');
                    }

                    if (!!target.attr('froala')) {
                        target = target.parents().find('div.froala-box');
                        if (!target.hasClass('custom-validation')) {
                            target.addClass('custom-validation');
                        }
                        if (elem.hasClass('ng-invalid')) {
                            target.addClass('ng-invalid');
                            target.removeClass('ng-valid');
                        } else {
                            target.removeClass('ng-invalid');
                        }
                    }
                }
            };

            app.lazy.directive("customValidation", ['ConfigApp', function (ConfigApp) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/$base.app.dest/components/common/form/customValidation.css')));
                return {
                    terminal: true,
                    restrict: 'A',
                    require: 'ngModel',
                    link: function ($scope, elem, attrs, ngModel) {
                        var validations = $scope.$eval(attrs.customValidation),
                            validationHandler = function (value, dispatchedBy) {
                                /*
                                @type validity: [<Object>{<String name>, <Boolan isValid<Func(value)>>, <Object formattedValue>, notifiers:[<Object>]}]
                                */
                                var formattedValue = undefined;
                                (validations || []).forEach(function (validity) {

                                    var setValidity = function (isValid) {
                                        ngModel.$setValidity(validity.name, isValid);
                                        if (formattedValue == undefined) {
                                            formattedValue = (validity.formattedValue || function () { return undefined; })(value);
                                        }
                                    };

                                    if (!dispatchedBy || !validity.triggers || validity.triggers.filter(function (item) { return item == dispatchedBy; }).length) {
                                        var isValid = validity.isValid(value);
                                        if (typeof (isValid) === 'boolean') {
                                            setValidity(isValid);
                                        }
                                        else if (isValid != undefined) {
                                            isValid.then(function () {
                                                setValidity(true);
                                            }, function () {
                                                setValidity(false);
                                            });
                                        }
                                    }
                                });

                                applyClassToTarget(elem, target);

                                return (formattedValue || value);
                            },
                            triggers = [],
                            target = getTarget(elem);

                        //Detecting changes for settings
                        if (!new RegExp("[a-zA-Z0-9]+[(]").test(attrs.customValidation)) {
                            $scope.$watch(attrs.customValidation, function (nval, oval) {
                                if (nval == oval) return;
                                validations = nval;
                                refreshTriggers(validationHandler, $scope, validations, triggers, ngModel);
                                validationHandler(ngModel.$viewValue);
                                (validations || []).forEach(function (validity) {
                                    var setValidity = function (isValid) {
                                        ngModel.$setValidity(validity.name, isValid);
                                    };

                                    validity.validate = function () {
                                        var isValid = validity.isValid(ngModel.$modelValue);
                                        if (typeof (isValid) === 'boolean') {
                                            setValidity(isValid);
                                        }
                                        else if (isValid != undefined) {
                                            isValid.then(function () {
                                                setValidity(true);
                                            }, function () {
                                                setValidity(false);
                                            });
                                        }
                                    };
                                });
                            });
                        }


                        elem.addClass('custom-validation');
                        if (target !== undefined) {
                            target.addClass('custom-validation');
                        }

                        //Init triggers
                        refreshTriggers(validationHandler, $scope, validations, triggers, ngModel);

                        //For DOM validation -> model
                        ngModel.$parsers.unshift(function (value) {
                            return validationHandler(value);
                        });

                        ////For model -> DOM validation
                        //ngModel.$formatters.unshift(function (value) {
                        //    return validationHandler(value);
                        //});

                        validationHandler(isNaN(ngModel.$modelValue) ? undefined : ngModel.$modelValue);

                        (validations || []).forEach(function (validity) {
                            validity.validate = function () {
                                ngModel.$setValidity(validity.name, validity.isValid(ngModel.$modelValue));
                            };
                        });
                    }
                };
            }]);
            app.lazy.directive("customCheckValidation", ['ConfigApp', function (ConfigApp) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/$base.app.dest/components/common/form/customValidation.css')));
                return {
                    restrict: 'A',
                    require: 'ngChecked',
                    link: function ($scope, elem, attrs, ngChecked) {
                        var validations = $scope.$eval(attrs.customValidation),
                            validationHandler = function (value, dispatchedBy) {
                                /*
                                @type validity: [<Object>{<String name>, <Boolan isValid>, <Object formattedValue>, notifiers:[<Object>]}]
                                */
                                var formattedValue = undefined;
                                (validations || []).forEach(function (validity) {
                                    if (!dispatchedBy || !validity.triggers || validity.triggers.filter(function (item) { return item == dispatchedBy; }).length) {
                                        ngChecked.$setValidity(validity.name, validity.isValid(value));
                                        if (formattedValue == undefined) {
                                            formattedValue = (validity.formattedValue || function () { return undefined; })(value);
                                        }
                                    }
                                });

                                applyClassToTarget(elem, target);

                                return (formattedValue || value);
                            },
                            triggers = [],
                            target = getTarget(elem);

                        //Detecting changes for settings
                        if (!new RegExp("[a-zA-Z0-9]+[(]").test(attrs.customValidation)) {
                            $scope.$watch(attrs.customValidation, function (nval, oval) {
                                if (nval == oval) return;
                                validations = nval;
                                refreshTriggers(validationHandler, $scope, validations, triggers, ngChecked);
                                validationHandler(ngChecked.$viewValue);
                            });
                        }

                        elem.addClass('custom-validation');
                        if (target !== undefined) {
                            target.addClass('custom-validation');
                        }

                        //Init triggers
                        refreshTriggers(validationHandler, $scope, validations, triggers, ngChecked);

                        //For DOM validation -> model
                        ngChecked.$parsers.unshift(function (value) {
                            return validationHandler(value);
                        });

                        validationHandler(isNaN(ngChecked.$modelValue) ? undefined : ngChecked.$modelValue);
                    }
                };
            }]);
            loaded = true;
        }
    });
})();
