(function () {
    var session = null, user = null, arrayType = typeof [];
    define([], function () {
        if (session == null) {
            session = {
                init: function (userData) {
                    if (!!userData) {
                        user = userData;
                    }
                    return session.isLogged();
                },
                clear: function () {
                    user = null;
                },
                isLogged: function () { return !!user && !!user.Id; },
                hasViewPermission: function (path) {
                    if (this.isLogged()) {
                        if (user.IsAdmin) {
                            return true;
                        }
                        path = path.replace('/#/', '/');
                        return (user.ViewResources || []).filter(function (item) {
                            return (item.Value == path || new RegExp('^' + item.Value + '$').test(path));
                        }).length > 0;
                    } else {
                        return false;
                    }
                },
                hasActionPermission: function (action) {
                    if (this.isLogged()) {
                        if (user.IsAdmin) {
                            return true;
                        }
                        return (user.ActionResources || []).filter(function (item) {
                            return item.Value == action;
                        }).length > 0;
                    } else {
                        return false;
                    }
                }
            };
        }
        return session;
    });
})();