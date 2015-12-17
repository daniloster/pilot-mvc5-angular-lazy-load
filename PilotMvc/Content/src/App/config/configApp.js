(function () {
    var loaded = false, configApp = {
        hasBaseUrl: !!appSettings.baseUrl,
        getPath: function (relativePath) {
            if (!!relativePath) {
                if (relativePath.indexOf('/') != 0) {
                    relativePath = '/' + relativePath;
                }
            } else {
                relativePath = '/';
            }
            return (!!appSettings.baseUrl ? appSettings.baseUrl + relativePath : relativePath).replace('$base.url', '');
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
            return "<link rel='stylesheet' type='text/css' href='" + configApp.getPath(configApp.getNoCachePath(path)) + "'/>";
        }
    };

    ConfigAppFactory.$inject = [];
    function ConfigAppFactory() {
        return configApp;
    }

    define(['app'], function (app) {
        if (!loaded) {
            loaded = true;
            app.lazy.constant('ConfigApp', configApp);
        }
    });
})();