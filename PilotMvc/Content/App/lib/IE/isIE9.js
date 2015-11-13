(function () {
    var isIE = null;
    define([], function () {
        if (isIE == null) {
            isIE = (function () {

                var ua = window.navigator.userAgent.toLowerCase();
                var msie = (ua+"").indexOf("msie ");

                if (msie > 0) {
                    var ieVersion = parseInt(ua.split('msie')[1]);
                    return ieVersion == 9;
                }

                return false;
            })();
        }
        return isIE;
    });

})();