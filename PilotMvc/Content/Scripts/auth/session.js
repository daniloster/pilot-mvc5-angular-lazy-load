(function () {
    var session = null, isLogged = false, token = null, name = null, email = null, userRoles = [], arrayType = typeof [],
        save = function ($cookieStore) {
            if (isLogged) {
                $cookieStore.put('Token', token);
                $cookieStore.put('Name', name);
                $cookieStore.put('Email', email);
                $cookieStore.put('UserRoles', userRoles.join('|#|'));
            }
        };
    define([], function () {
        if (session == null) {
            session = {
                init: function ($cookieStore, user) {
                    if (!!user && !!user.Token) {
                        token = user.Token;
                        name = user.Name;
                        email = user.Email;
                        userRoles = user.UserRoles;
                        isLogged = true;
                        save($cookieStore);
                        return true;
                    } else if (!!$cookieStore.get('Token')) {
                        token = $cookieStore.get('Token');
                        name = $cookieStore.get('Name');
                        email = $cookieStore.get('Email');
                        userRoles = $cookieStore.get('UserRoles').split('|#|');
                        isLogged = true;
                        return true;
                    }
                    return false;
                },
                clear: function ($cookieStore) {
                    $cookieStore.remove('Token');
                    $cookieStore.remove('Name');
                    $cookieStore.remove('Email');
                    $cookieStore.remove('UserRoles');
                },
                isLogged: function () { return isLogged; },
                setUserRoles: function (roles) { userRoles = roles; },
                hasPermission: function (rolesGranted) {
                    if (typeof rolesGranted != arrayType) {
                        rolesGranted = [rolesGranted];
                    }
                    if (rolesGranted.length > 0) {
                        return rolesGranted.filter(function (val, idx) {
                            return userRoles.indexOf(val.toString()) >= 0;
                        }).length > 0;
                    } else {
                        return true;
                    }
                }
            };
        }
        return session;
    });
})();