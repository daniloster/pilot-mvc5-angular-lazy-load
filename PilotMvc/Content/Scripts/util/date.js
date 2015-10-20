(function () {
    var hasNotBeenApplied = true;
    define([], function () {
        if (hasNotBeenApplied) {

            Date.prototype.onlyDate = function () {
                return new Date(this.getFullYear(), this.getMonth(), this.getDate());
            };
            
            hasNotBeenApplied = false;
        }
    });
})();