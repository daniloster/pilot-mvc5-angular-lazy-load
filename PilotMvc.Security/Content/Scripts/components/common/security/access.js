(function () {
    var loaded = false;
    define(['angular', 'app', 'auth/session'], function (angular, app, session) {
        if (!loaded) {
            app.lazy.directive('accessDisabled', [function () {
                return {
                    replace: false,
                    restrict: 'A',
                    link: function (scope, elem, attrs) {
                        var isDisabled = function (action) {
                            var isValid = session.hasActionPermission(action);
                            return !(isValid && (attrs.customDisable == undefined || scope[attrs.customDisable] == undefined || !scope[attrs.customDisable]));
                        };

                        if (!!attrs.customDisable) {
                            scope.$watch(attrs.customDisable, function (nval, oval) {
                                if (nval == oval) return;
                                scope.$accessDisabled = isDisabled(attrs.accessDisabled);
                            });
                        }

                        scope.$watch('$accessDisabled', function (nval, oval) {
                            if (nval != oval) {
                                if (nval == true) {
                                    elem.attr('disabled', 'disabled');
                                } else {
                                    elem.removeAttr('disabled');
                                }
                            }
                        });

                        scope.$accessDisabled = isDisabled(attrs.accessDisabled);
                        if (scope.$accessDisabled == true) {
                            elem.attr('disabled', 'disabled');
                        } else {
                            elem.removeAttr('disabled');
                        }
                    }
                };
            }]);
            app.lazy.directive('accessHidden', [function () {
                return {
                    replace: false,
                    restrict: 'A',
                    link: function (scope, elem, attrs) {
                        var firstAssigning = true;
                        var isHidden = function (action) {
                            var isValid = session.hasActionPermission(action);
                            return !(isValid && (attrs.customHidden == undefined || scope[attrs.customHidden] == undefined || !scope[attrs.customHidden]));
                        };

                        if (!!attrs.customHidden) {
                            scope.$watch(attrs.customHidden, function (nval, oval) {
                                if (nval == oval) return;
                                scope.$accessHidden = isHidden(attrs.accessHidden);
                            });
                        }

                        scope.$watch('$accessHidden', function (nval, oval) {
                            if (nval != oval) {
                                if (nval == true) {
                                    elem.addClass('ng-hide');
                                } else {
                                    elem.removeClass('ng-hide');
                                }
                            }
                        });

                        scope.$accessHidden = isHidden(attrs.accessHidden);
                        if (scope.$accessHidden == true) {
                            elem.addClass('ng-hide');
                        } else {
                            elem.removeClass('ng-hide');
                        }
                    }
                };
            }]);

            loaded = true;
        }
    });
})();