(function () {
    var loaded = false;
    define(['app', 'components/pagination/paginationDct'], function (app) {
        if (!loaded) {
            app.filter('offset', function () {
                return function (input, start) {
                    start = parseInt(start, 10);
                    if (!!input)
                        return input.slice(start);
                };
            });
            loaded = true;
        }
    });
})();