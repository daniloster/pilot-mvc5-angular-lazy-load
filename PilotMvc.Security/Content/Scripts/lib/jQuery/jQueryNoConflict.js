(function () {
    var noConflicted;
    define(['jqStandard'], function (jQuery) {
        if (!noConflicted) {

            noConflicted = jQuery;//.noConflict();

        }

        return noConflicted;

    });

})();