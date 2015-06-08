(function () {
    var loaded = false;
    define(['app', 'jquery'], function (app, $) {
        if (!loaded) {
            var scrollTo = function (target, offsetTop) {
                var element = (firstInvalid = $(target));
                // if we find one, set focus
                if (firstInvalid && firstInvalid.length) {
                    container = $('html,body');

                    var parent = firstInvalid.parent('.form-group');
                    if (parent.length) {
                        firstInvalid = parent;
                    }
                    $('html,body').animate({
                        scrollTop: firstInvalid.offset().top + (offsetTop == undefined ? 0 : offsetTop)
                    }, {
                        duration: 800,
                        complete: function () {
                            if (element.attr('disable-focus') == undefined)
                                element.focus();
                        }
                    });




                    return true;
                }
                return false;
            }, scrollToWithMessage = function ($rootScope, invalid, target, msg, offsetTop) {
                var result = scrollTo(target, offsetTop);
                if (result) {
                    $rootScope.updateErrorMessage(msg == undefined ? $('[message-error=' + invalid.$name + '-' + invalid.$typeError + ']').html() : msg);
                }
            },
            getName = function (elem) {
                if (elem.$addControl == undefined) {
                    return elem.$name;
                }
                return getName(elem);
            },

            findInvalidElement = function (form, typeError) {
                var errors = [], elCur, elPrev, formName = form.$parentName || form.$name;
                for (var hash in form.$error) {
                    if ((typeError == undefined || hash == typeError) && $.isArray(form.$error[hash])) {
                        errors.push(form.$error[hash].reduce(function (previous, current) {
                            if (current.$addControl != undefined) {
                                current.$parentName = formName;
                                current = findInvalidElement(current, hash);
                            }
                            if (previous == null) {
                                current.$typeError = hash;
                                return current;
                            }
                            elCur = $('form[name=' + formName + '] [name=' + getName(current) + ']').offset();
                            elPrev = $('form[name=' + formName + '] [name=' + getName(previous) + ']').offset();
                            if ((elCur.top < elPrev.top) || (elCur.top == elPrev.top && elCur.left < elPrev.left)) {
                                current.$typeError = hash;
                                return current;
                            } else
                                previous.$typeError = hash;
                            return previous;
                        }, null));
                    }
                }
                var invalid = errors.length == 1 ? errors[0] : errors.reduce(function (previous, current) {
                    if (previous == null) return current;

                    elCur = $('form[name=' + formName + '] [name=' + getName(current) + ']').offset();
                    elPrev = $('form[name=' + formName + '] [name=' + getName(previous) + ']').offset();
                    if ((elCur.top < elPrev.top) || (elCur.top == elPrev.top && elCur.left < elPrev.left)) {
                        return current;
                    }
                    return previous;
                }, null);

                return invalid;
            };

            app.lazy.filter('focusInvalid', ['ConfigApp', function (ConfigApp) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/form/focusInvalid.css')));
                return function (fieldName, offsetTop) {
                    return scrollTo('[name=' + fieldName + ']', offsetTop);
                };
            }]);

            app.lazy.filter('focusFirstInvalid', ['ConfigApp', function (ConfigApp) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/form/focusInvalid.css')));
                return function (form, offsetTop) {
                    if (!!form.$error) {
                        var invalid = findInvalidElement(form);
                        return invalid != null && scrollTo('form[name=' + form.$name + '] [name=' + getName(invalid) + ']', offsetTop);
                    }
                    return false;
                };
            }]);

            app.lazy.filter('messageFirstInvalid', ['ConfigApp', '$rootScope', function (ConfigApp, $rootScope) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/form/focusInvalid.css')));
                return function (form, offsetTop) {
                    if (!!form.$error) {
                        var invalid = findInvalidElement(form);
                        return invalid != null && scrollToWithMessage($rootScope, invalid, 'form[name=' + form.$name + '] [name=' + getName(invalid) + ']', undefined, offsetTop);
                    }
                    return false;
                };
            }]);

            app.lazy.filter('messageCustomInvalid', ['ConfigApp', '$rootScope', function (ConfigApp, $rootScope) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/form/focusInvalid.css')));
                return function (form, invalid, msg, offsetTop) {
                    return invalid != null && scrollToWithMessage($rootScope, invalid, 'form[name=' + form.$name + '] [name=' + getName(invalid) + ']', msg, offsetTop);
                };
            }]);

            app.lazy.filter('messageTypeInvalid', ['ConfigApp', '$rootScope', function (ConfigApp, $rootScope) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/form/focusInvalid.css')));
                return function (form, invalid, type, offsetTop) {
                    invalid.$typeError = type;
                    var result = scrollToWithMessage($rootScope, invalid, 'form[name=' + form.$name + '] [name=' + getName(invalid) + ']', undefined, offsetTop);
                    invalid.$typeError = null;
                    return result;
                };
            }]);

            loaded = true;
        }
    });
})();