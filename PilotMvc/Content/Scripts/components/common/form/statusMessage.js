(function () {
    var loaded = false;
    define(['angular', 'app'], function (angular, app) {
        if (!loaded) {
            app.lazy.directive("statusMessage", ['ConfigApp', function (ConfigApp) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/form/statusMessage.css')));
                return {
                    controller: ['$rootScope', '$timeout', function ($rootScope, $timeout) {

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

                            $rootScope.errorMessageHandler = function (ticket) {
                                if (ticket == $rootScope.ticketErrorMessage) {
                                    $rootScope.errorMessage = null;
                                }
                            };

                            $rootScope.updateErrorMessage = function (msg) {
                                if (msg != undefined) {
                                    if (!!msg) {
                                        this.updateSuccessMessage(null);
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
                                        this.updateErrorMessage(null);
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

                            $rootScope.initialized = true;
                        }

                    }],
                    restrict: 'EA',
                    templateUrl: ConfigApp.getPath('/Content/Scripts/components/common/form/statusMessage.html'),
                    link: function (scope, elem, attrs) {
                        if (!!attrs.smPosition && attrs.smPosition.toLowerCase() == "relative") {
                            elem.addClass('message-insidebox');
                        } else {
                            elem.addClass('message-top-fixed');
                        }
                    }
                };
            }]);
            loaded = true;
        }
    });
})();
