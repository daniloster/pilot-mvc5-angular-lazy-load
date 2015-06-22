(function () {
    var loaded = false;
    define(['angular', 'app'], function (angular, app) {
        if (!loaded) {
            function init(value, defaultValue) {
                return (!!value) ? value : defaultValue;
            }

            app.lazy.directive('pilotPassword', ['ConfigApp', function (ConfigApp) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/form/password/style.css')));

                return {
                    restrict: 'EA',
                    replace: true,
                    scope: {
                        pilotPasswordName: '@',
                        pilotPasswordLabel: '@',
                        pilotPasswordModel: "=?"
                    },
                    templateUrl: ConfigApp.getPath('/Content/Scripts/components/common/form/password/template.html'),

                    link: function (scope, elem, attrs) {
                        scope.showHide = "Show";
                        scope.pilotPasswordName = init(scope.pilotPasswordName, 'password-' + new Date().getTime());

                        var password = elem.find('[type=password]');
                        password.attr('id', scope.pilotPasswordName);
                        password.attr('name', scope.pilotPasswordName);
                        password.attr('placeholder', scope.pilotPasswordLabel);

                        scope.showPassword = function () {

                            if (scope.showHide == "Show") {
                                password.attr('type', "text");
                                scope.showHide = "Hide";
                            } else {
                                password.attr('type', "password");
                                scope.showHide = "Show";                                
                            }
                        };
                    }
                };
            }]);
            loaded = true;
        }
    });
})();