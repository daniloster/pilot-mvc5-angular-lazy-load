(function () {
    var hasNotBeenApplied = true;
    define([], function () {
        if (hasNotBeenApplied) {

            String.prototype.replaceAll = function (matches, newVal, mustPerform) {
                var str = this.toString();
                while ((mustPerform == undefined || !!mustPerform) && str.indexOf(matches) > -1) str = str.replace(matches, newVal);

                return str;
            };

            if (!String.prototype.trim) {
                String.prototype.trim = function () {
                    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
                };
            }

            String.prototype.firstDifference = function (otherStr) {
                var str = !!this ? this.toString() : '', comp = !!otherStr ? otherStr.toString() : '';
                if (str.length == 0 || otherStr.length == 0) return 0;
                for (var i = 0; i < Math.min(str.length, comp.length) ; i++) {
                    if (str.charAt(i) !== comp.charAt(i)) { return i; }
                }
                if (str.length !== comp.length) { return Math.min(str.length, comp.length); }
                return -1;
            };

            hasNotBeenApplied = false;
        }
    });
})();