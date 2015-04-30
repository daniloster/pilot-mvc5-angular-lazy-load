(function () {
    var loaded = false;
    define(['app'], function (app) {
        if (!loaded) {
            app.lazy.animation('.anim-slide', function () {
                var NG_HIDE_CLASS = 'ng-hide';
                return {
                    beforeAddClass: function (element, className, done) {
                        if (className === NG_HIDE_CLASS) {
                            element.slideUp(done);
                        }
                    },
                    removeClass: function (element, className, done) {
                        if (className === NG_HIDE_CLASS) {
                            element.hide().slideDown(done);
                        }
                    }
                }
            });

            loaded = true;
        }
    });
})();