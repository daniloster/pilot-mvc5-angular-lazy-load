(function () {
    var isIE11 = null;
    define([], function () {
        if (isIE11 == null) {
            isIE11 = (function () {
                var ua = window.navigator.userAgent;
                return !!ua.match(/Trident.*rv[ :]*11\./);
            })();
        }
        return isIE11;
    });

})();