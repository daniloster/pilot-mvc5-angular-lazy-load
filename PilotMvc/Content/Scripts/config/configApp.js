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
                },
                getNoCachePath: function (path) {
                    if (path.indexOf('?') > -1) {
                        path = path + '&ngBust=' + appSettings.ngBust;
                    } else {
                        path = path + '?ngBust=' + appSettings.ngBust;
                    }
                    return path;
                },
                getElementLink: function (path) {
                    return "<link rel='stylesheet' type='text/css' href='" + this.getPath(this.getNoCachePath(path)) + "'/>";
                }
            });

            loaded = true;
        }
    });
})();