(function () {
    var loaded = false;
    define(['app'], function (app) {
        if (!loaded) {
            
            app.lazy.factory('Debugger', [function () {
                return {
                    debug: function () {
                        if (!!appSettings.debug && !!console) {
                            console.log(arguments);
                        }
                    },
                    enable: function (rejection) {
                        appSettings.debug = true;
                    },
                    disable: function () {
                        appSettings.debug = false;
                    }
                };
            }]);

            loaded = true;
        }
    });
})();