(function () {
    var isIE = null;
    define([], function () {
        if (isIE == null) {
            isIE = (function () {

                var ua = window.navigator.userAgent;
                var msie = (ua+"").indexOf("MSIE ");

                return (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./));
            })();
        }
        return isIE;
    });

})();