(function () {
    var hasNotBeenApplied = true;
    define([], function () {
        if (hasNotBeenApplied) {

            String.prototype.replaceAll = function (matches, newVal, mustPerform) {
                var str = this.toString();
                while ((mustPerform == undefined || !!mustPerform) && str.indexOf(matches) > -1) str = str.replace(matches, newVal);

                return str;
            };

            hasNotBeenApplied = false;
        }
    });
})();