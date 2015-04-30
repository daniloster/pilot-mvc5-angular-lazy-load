(function () {
    var loaded = false;
    define(['app'], function (app) {
        if (!loaded) {
            app.lazy.directive("compareTo", function () {
                return {
                    require: "ngModel",
                    scope: {
                        otherModelValue: "=compareTo"
                    },
                    link: function (scope, element, attributes, ngModel) {

                        ngModel.$parsers.unshift(function (viewValue) {
                            if (viewValue == scope.otherModelValue) {
                                ngModel.$setValidity('compareTo', true);
                                return viewValue;
                            }else{
                                ngModel.$setValidity('compareTo', false);
                                return undefined;
                            }
                        });
                    }
                };
            });
            loaded = true;
        }
    });
})();