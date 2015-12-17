(function () {
    var loaded = false, defineNavigation = (function () {
        var history = [], currentContext = null;
        return function ($root, $location) {
            if ($root.$userNavigation == undefined) {

                $root.$userNavigation = {
                    saveState: function (context) {
                        var url = $location.url(), ticket = $root.$userNavigation.$ticket;
                        if (ticket == undefined) {
                            if (history.length && history[history.length - 1].url === url) {
                                history[history.length - 1].context = (!context ? null : JSON.parse(JSON.stringify(context))) || history[history.length - 1].context;
                                return;
                            }
                            history.push({
                                url: url,
                                ticket: new Date().getTime(),
                                context: !context ? null : JSON.parse(JSON.stringify(context))
                            });
                            currentContext = null;
                        } else {
                            $root.$userNavigation.$ticket = undefined;
                        }
                    },
                    context: function () {
                        return currentContext;
                    },
                    back: function () {
                        if (history.length) {
                            history.splice(history.length - 1, 1);
                            if (history.length) {
                                var page = history[history.length - 1];
                                $root.$userNavigation.$ticket = page.ticket;
                                currentContext = page.context;
                                $location.url(page.url);
                                return true;
                            }
                        }
                        return false;
                    },
                    historyBack: function () {
                        $root.errorMessage = null;
                        return $root.$userNavigation.back();
                    }
                };

                $root.historyBack = function () {
                    $root.$userNavigation.historyBack();
                };
            }
        };
    })();
    define(['app'], function (app) {
        if (!loaded) {
            loaded = true;
            app.run(['$rootScope', '$location', function ($rootScope, $location) {
                defineNavigation($rootScope, $location);
            }]);
        }
    });
})();