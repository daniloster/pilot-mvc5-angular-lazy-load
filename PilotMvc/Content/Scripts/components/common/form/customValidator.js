(function () {
    define([], function () {
        return function(name, triggers, isValid, formattedValue) {
            this.name = name;
            this.isValid = isValid;
            this.triggers = triggers;
            this.formattedValue = formattedValue;
        };
    });
})();