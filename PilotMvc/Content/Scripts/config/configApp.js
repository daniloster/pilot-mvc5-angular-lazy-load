(function () {
    var loaded = false;
    define(['app'], function (app) {
        if (!loaded) {
            
            var _base;
            try {
                _base = baseUrl || '';
            } catch (e) { }

            app.lazy.constant('ConfigApp', {
                hasBaseUrl: !!_base,
                getPath: function (relativePath) {
                    if (!!relativePath) {
                        if (relativePath.indexOf('/') != 0) {
                            relativePath = '/' + relativePath;
                        }
                    } else {
                        relativePath = '/';
                    }
                    return !!_base ? _base + relativePath : relativePath;
                }
            });

            loaded = true;
        }
    });
})();