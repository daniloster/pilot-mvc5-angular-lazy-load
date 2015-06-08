(function () {
    var loaded = false;
    define(['angular', 'app', 'auth/session'], function (angular, app, session) {
        if (!loaded) {
            app.lazy.directive('accessDisabled', [function () {
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

            //app.lazy.decorator('ngDisabledDirective', ['ConfigApp', '$rootScope', '$location', function (ConfigApp, $rootScope, $location) {
            //    return {
            //        restrict: 'A',
            //        scope: {
            //            mustDisable: '=ngDisabled'
            //        },
            //        link: function ($scope, elem, attrs) {

            //            $rootScope.$on('Access:validate', function (evt) {

            //            });

            //            var active = elem.attr('href');

            //            elem.on('click', function () {
            //                check($('[nav-check]'), active);
            //            });

            //            checkItem($(elem), $location.path());
            //        }
            //    };
            //}]);
            loaded = true;
        }
    });
})();