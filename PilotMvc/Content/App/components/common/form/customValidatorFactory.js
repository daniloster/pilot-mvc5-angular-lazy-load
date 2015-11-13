(function () {
    function CustomValidatorFactory() {
            return {
                create: function (name, triggers, isValid, formattedValue) {
                    return {
                        name: name,
                        isValid: isValid,
                        triggers: triggers,
                        formattedValue: formattedValue
                    };
                }
            };
    }
    var loaded = false;
    define(['app'], function (app) {
        if (!loaded) {
            laoded = true;

            app.lazy.factory('CustomValidatorFactory', CustomValidatorFactory);
        }
    });
})();