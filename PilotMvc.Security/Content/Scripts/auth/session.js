(function () {
    var session = null, user = null, cookieKey = 'pilot.user.security', arrayType = typeof [],
        save = function ($cookieStore) {
            if (isLogged) {
                $cookieStore.put(cookieKey, JSON.stringify(user));
            }
        };
    define([], function () {
        if (session == null) {
            session = {
                init: function ($cookieStore, userData) {
                    if (!!userData && !!userData.Id) {
                        user = userData;
                        save($cookieStore);
                        return true;
                    } else if (!!$cookieStore.get(cookieKey)) {
                        user = JSON.parse($cookieStore.get(cookieKey));
                        return true;
                    }
                    return false;
                },
                clear: function ($cookieStore) {
                    $cookieStore.remove(cookieKey);
                },
                isLogged: function () { return !!user; },
                hasViewPermission: function (path) {
                    if (this.isLogged()) {
                        if (user.IsAdmin) {
                            return true;
                        }
                        path = path.replace('/#/', '/');
                        return user.ViewResources.filter(function (item) {
                            return (item.Value == path || new RegExp('^' +item.Value+ '$').test(path));
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
                        return user.ActionResources.filter(function (item) {
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