(function () {
    var loaded = false;
    define(['angular', 'app', 'auth/session'], function (angular, app) {
        if (!loaded) {
            app.lazy.directive('accessDisabled', ['Session', function (session) {
                return {
                    restrict: 'A',
                    scope: {
                        mustDisabled: '=ngDisabled'
                    },
                    compile: function (element, attribute) {
                        //attribute
                        element.attr('ng-disabled', '$accessDisabled');

                        return function (scope, elem, attrs) {
                            var isDisabled = function (action) {
                                var isValid = session.hasActionPermission(action);
                                return !(isValid && (scope.mustDisabled == undefined || !scope.mustDisabled));
                            };

                            scope.$watch('mustDisabled', function (nval, oval) {
                                if (nval == oval) return;
                                scope.$accessDisabled = isDisabled(attrs.accessDisabled);
                            });

                            scope.$accessDisabled = isDisabled(attrs.accessDisabled);
                        };
                    }
                };
            }]);
            loaded = true;
        }
    });
})();