(function () {
    var loaded = false;
    define(['app'], function (app) {
        if (!loaded) {
            app.lazy.animation('.anim-fade', function () {
                var NG_FADE_CLASS = 'fade-in';
                return {
                    beforeAddClass: function (element, className, done) {
                        if (className === NG_FADE_CLASS) {
                            element.fadeIn(done);
                        }
                    },
                    removeClass: function (element, className, done) {
                        if (className === NG_FADE_CLASS) {
                            element.fadeOut(done);
                        }
                    }
                }
            });

            loaded = true;
        }
    });
})();