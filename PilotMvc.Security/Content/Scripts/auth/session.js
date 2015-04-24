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
                hasViewPermission: function (path, systemId) {
                    if (this.isLogged()) {
                        path = path.replace('/#/', '/');
                        user.ViewResources.filter(function (item) {
                            return item.System.Id == systemId && item.Value == path;
                        }).length > 0;
                    } else {
                        return false;
                    }
                },
                hasActionPermission: function (action, systemId) {
                    if (this.isLogged()) {
                        user.ActionResources.filter(function (item) {
                            return item.System.Id == systemId && item.Value == action;
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