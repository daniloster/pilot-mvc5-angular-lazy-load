(function () {
    var loaded = false, cssAdded = [];
    define(['angular', 'app'], function (angular, app) {
        if (!loaded) {
            loaded = true;
            $.fn.reduce = function (fnReduce, valueInitial) {
                if (Array.prototype.reduce) {
                    return Array.prototype.reduce.call(this, fnReduce, valueInitial);
                }

                $.each(this, function (i, value) {
                    valueInitial = fnReduce.call(null, valueInitial, value, i, this);
                });
                return valueInitial;
            };

            var scrollTo = function (target, offsetTop) {
                //target += '.ng-invalid';
                var element = (firstInvalid = $(target));
                // if we find one, set focus
                if (firstInvalid && firstInvalid.length) {
                    container = $('html,body');

                    var parent = firstInvalid.parent('.form-group');
                    if (parent.length) {
                        firstInvalid = parent;
                    }
                    $('html,body').animate({
                        scrollTop: firstInvalid.offset().top + (offsetTop == undefined ? -190 : offsetTop)
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
            },
            getMessage = function (invalid, target) {
                return $(target).attr('message-' + invalid.$typeError) || $('[message-error=' + invalid.$name + '-' + invalid.$typeError + ']').html();
            },
            scrollToWithMessage = function ($rootScope, invalid, target, msg, offsetTop) {
                var result = scrollTo(target, offsetTop);
                //target += '.ng-invalid';
                if (result) {
                    var message = getMessage(invalid, target);
                    $rootScope.updateErrorMessage(msg === undefined ? message : msg);
                }
            },
            getName = function (elem) {
                if (elem.$addControl == undefined) {
                    return elem.$name;
                }
                return getName(elem);
            },
            addCssFile = function (ConfigApp) {
                if (cssAdded.indexOf('/$base.app.dest/components/common/form/customValidation.css') < 0) {
                    angular.element('body').after(angular.element(ConfigApp.getElementLink('/$base.app.dest/components/common/form/customValidation.css')));
                    cssAdded.push('/$base.app.dest/components/common/form/customValidation.css');
                }
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
                            elCur = $('form[name=' + formName + '] [name=' + getName(current) + '].ng-invalid').reduce(function (previous, actual) {
                                if (previous === undefined) return $(actual);
                                actual = $(actual);
                                if ((actual.offset().top < previous.offset().top) || (actual.offset().top == previous.offset().top && actual.offset().left < previous.offset().left)) {
                                    return item;
                                } else {
                                    return previous;
                                }
                            });
                            current.$myInvalidElement = elCur;
                            elCur = elCur.offset();
                            if (previous == null) {
                                current.$typeError = hash;
                                return current;
                            }
                            elPrev = $('form[name=' + formName + '] [name=' + getName(previous) + '].ng-invalid').reduce(function (previous, actual) {
                                if (previous === undefined) return $(actual);
                                actual = $(actual);
                                if ((actual.offset().top < previous.offset().top) || (actual.offset().top == previous.offset().top && actual.offset().left < previous.offset().left)) {
                                    return item;
                                } else {
                                    return previous;
                                }
                            });
                            previous.$myInvalidElement = elPrev;
                            elPrev = elPrev.offset();
                            if ((elCur.top < elPrev.top) || (elCur.top == elPrev.top && elCur.left < elPrev.left)) {
                                current.$typeError = hash;
                                return current;
                            } else {
                                previous.$typeError = hash;
                                return previous;
                            }
                        }, null));
                    }
                }
                var invalid = errors.length == 1 ? errors[0] : errors.reduce(function (previous, current) {
                    if (previous == null) return current;

                    elCur = current.$myInvalidElement.offset();
                    elPrev = previous.$myInvalidElement.offset();
                    if ((elCur.top < elPrev.top) || (elCur.top == elPrev.top && elCur.left < elPrev.left)) {
                        return current;
                    }
                    return previous;
                }, null);

                return invalid;
            };

            app.lazy.directive("statusMessage", ['ConfigApp', function (ConfigApp) {
                addCssFile(ConfigApp);
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/$base.app.dest/components/common/form/statusMessage.css')));
                return {
                    restrict: 'EA',
                    templateUrl: ConfigApp.getPath('/$base.app.dest/components/common/form/statusMessage.html'),
                    link: function (scope, elem, attrs) {
                        if (!!attrs.smPosition && attrs.smPosition.toLowerCase() == "relative") {
                            elem.addClass('message-insidebox');
                        } else {
                            elem.addClass('message-top-fixed');
                        }
                    },
                    scope: {
                        form: '=?smForm'
                    },
                    controller: ['$rootScope', '$scope', '$filter', '$timeout', function ($rootScope, $scope, $filter, $timeout) {
                        
                        if (!$rootScope.initialized) {
                            $rootScope.checkErrorProp = function ($error, prop, innerProp) {
                                var invalid = !!$error && !angular.isArray($error[prop]) && (!!$error[prop]);
                                if (innerProp != undefined && $error[prop] != undefined && angular.isArray($error[prop])) {
                                    return $error[prop].filter(function (item) {
                                        if (item.$addControl != undefined) {
                                            var amount = item.$error[prop].filter(function (innerItem) {
                                                return innerItem.$name == innerProp;
                                            }).length;
                                            return amount > 0;
                                        } else if (item.$name == innerProp) {
                                            return true;
                                        }
                                    }).length > 0;
                                }
                                return invalid;
                            };

                            $rootScope.clearMessages = function () {
                                $rootScope.errorMessage = null;
                                $rootScope.successMessage = null;
                            };

                            $rootScope.errorMessageHandler = function (ticket) {
                                if (ticket == $rootScope.ticketErrorMessage) {
                                    $rootScope.errorMessage = null;
                                }
                            };

                            $rootScope.updateErrorMessage = function (msg) {
                                if (msg != undefined) {
                                    if (!!msg) {
                                        $rootScope.clearMessages();
                                    }
                                    $rootScope.errorMessage = msg;
                                }
                                (function (ticket) {
                                    $rootScope.ticketErrorMessage = ticket;
                                    $timeout(function () {
                                        $rootScope.errorMessageHandler(ticket);
                                    }, 10000);

                                })(new Date().getTime());
                            };

                            $rootScope.$watch('$root.errorMessage', function (newValue, oldValue) {
                                if (!!newValue && newValue != oldValue)
                                    $rootScope.updateErrorMessage();

                            });

                            $rootScope.successMessageHandler = function (ticket) {
                                if (ticket == $rootScope.ticketSuccessMessage) {
                                    $rootScope.successMessage = null;
                                }
                            };

                            $rootScope.updateSuccessMessage = function (msg) {
                                if (msg != undefined) {
                                    if (!!msg) {
                                        $rootScope.clearMessages();
                                    }
                                    $rootScope.successMessage = msg;
                                }
                                (function (ticket) {
                                    $rootScope.ticketSuccessMessage = ticket;
                                    $timeout(function () {
                                        $rootScope.successMessageHandler(ticket);
                                    }, 10000);

                                })(new Date().getTime());
                            };

                            $rootScope.$watch('$root.successMessage', function (newValue, oldValue) {
                                if (!!newValue && newValue != oldValue)
                                    $rootScope.updateSuccessMessage();

                            });

                            if (!!$scope.form) {
                                $scope.$on('ValidateFormAndSubmit[' + $scope.form.$name + ']', function (evt, options) {
                                    if (!!options.submit) {
                                        if ($scope.form.$invalid) {
                                            $scope.$control = findInvalidElement($scope.form);
                                            var result = scrollTo($scope.$control.$myInvalidElement, $scope.offsetTop);
                                            if (result) {
                                                $scope.errorMessage = !!$scope.$control ? getMessage($scope.$control, $scope.$control.$myInvalidElement) : null;
                                            }
                                            return false;
                                        }
                                        options.submit();
                                    } else if (!!options.message) {
                                        if (options.status) {
                                            $scope.successMessage = options.message;
                                        } else {
                                            $scope.errorMessage = options.message;
                                        }
                                    } else {
                                        $scope.errorMessage = null;
                                        $scope.successMessage = null;
                                    }
                                });
                            }

                            $rootScope.initialized = true;
                        }

                    }]
                };
            }]);
            app.lazy.directive("submitValidation", [function () {
                return {
                    restrict: 'A',
                    scope: {
                        ngSubmitValidation: '&submitValidation'
                    },
                    controller: ['$scope', function ($scope) {
                        $scope.sendNotification = function (target) {
                            $scope.$parent.$broadcast(target, { submit: function () { scope.ngSubmitValidation(); } })
                        };
                    }],
                    link: function ($scope, elem, attrs) {
                        elem.attr('novalidate', 'novalidate');
                        var formName = elem.attr('name');
                        elem.submit(function (event) {
                            $scope.$apply(function () {
                                $scope.sendNotification('ValidateFormAndSubmit[' + formName + ']');
                            });
                        });
                    }
                };
            }]);
        }
    });
})();
