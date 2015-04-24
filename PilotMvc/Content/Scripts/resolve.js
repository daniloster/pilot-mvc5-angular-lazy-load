(function () {
    var systemId = 1, definitions = ['auth/userController', 'app/home/homeController'], redirect = function (routeForUnauthorizedAccess, $location, $rootScope, deferred) {
        //If user does not have required access, we will route the user to unauthorized access page
        $location.path(routeForUnauthorizedAccess);
        //As there could be some delay when location change event happens, 
        //we will keep a watch on $locationChangeSuccess event
        // and would resolve promise when this event occurs.
        $rootScope.$on('$locationChangeSuccess', function (next, current) {
            deferred.resolve();
        });
    };
    define(['auth/session'], function (session) {
        return function (data) {
            var dependencies = data.dependencies || [], isPublic = data.isPublic || (data.isPublic == undefined), title = data.title || undefined;

            return {
                load: ['$q', '$rootScope', function ($q, $rootScope) {
                    var deferred = $q.defer(), dependenciesNotLoaded = [];
                    dependencies.forEach(function (val) {
                        if (definitions.indexOf(val) < 0) {
                            definitions.push(val);
                            dependenciesNotLoaded.push(val);
                        }
                    });
                    if (dependenciesNotLoaded.length) {
                        // Load the dependencies
                        require(dependenciesNotLoaded, function () {
                            // all dependencies have now been loaded by so resolve the promise
                            $rootScope.$apply(function () {
                                deferred.resolve();
                            });
                        });
                    } else {
                        deferred.resolve();
                    }
                    return deferred.promise;
                }],
                permission: ['$q', '$route', '$location', '$rootScope', '$cookieStore', 'AuthorizationService',
                    function ($q, $route, $location, $rootScope, $cookieStore, authorizationSvc) {
                    var deferred = $q.defer(), authorized = $q.defer(), path = $location.path();

                    deferred.promise.then(function () {
                        if (title != undefined) {
                            $rootScope.title = title;
                        }
                        authorized.resolve();
                    }, function () {
                        /// redirect to not authorized page
                        redirect('/not-authorized', $location, $rootScope, authorized);
                    });

                    if (isPublic) {
                        deferred.resolve();
                    } else {
                        if (session.init($cookieStore)) {
                            if (session.hasViewPermission(path, systemId)) {
                                deferred.resolve();
                            } else {
                                /// redirect to not authorized page
                                deferred.reject();
                            }
                        } else {
                            // In that case, it is necessary to load the user from session
                            authorizationSvc.getCurrent(function (data) {
                                if (session.init($cookieStore, data)) {
                                    if (session.hasViewPermission(path, systemId)) {
                                        deferred.resolve();
                                    } else {
                                        /// redirect to not authorized page
                                        deferred.reject();
                                    }
                                } else {
                                    /// redirect to not authorized page
                                    deferred.reject();
                                }
                            }, function (data) {
                                /// redirect to login page
                                redirect('/login', $location, $rootScope, authorized);
                            });
                        }
                    }
                    return authorized.promise;
                }]
            };
        };
    });
})();