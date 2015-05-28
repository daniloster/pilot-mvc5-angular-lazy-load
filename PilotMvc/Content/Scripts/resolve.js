(function () {
    //Cache of the dependencies loaded
    //@type dependencies <Array<String>>
    var definitions = [];

    define(['auth/session'], function (session) {

        /*
        Resolve function which intercept route changes in order to load the 
        dependencies and validate navigating permission.
        */
        return function (data) {
            /*
            Dependencies must be feeded as requirejs syntax.
            */
            //@type dependencies <Array<String>>
            var dependencies = data.dependencies || [],
                //@type isPublic <Booelan>
                isPublic = data.isPublic || (data.isPublic == undefined),
                //@type title <String>
                title = data.title || undefined;

            return {
                /*
                It loads all the dependencies just one time checking occurrence on definitions <Array<String>>
                */
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
                permission: ['$q', '$route', '$location', '$rootScope', 'AuthorizationService',
                function ($q, $route, $location, $rootScope, authorizationSvc) {
                    var deferred = $q.defer(), authorized = $q.defer(), path = $location.path(),
                        redirect = function (routeForUnauthorizedAccess) {
                            //If user does not have required access, we will route the user to unauthorized access page
                            $location.path(routeForUnauthorizedAccess);
                            //As there could be some delay when location change event happens, 
                            //we will keep a watch on $locationChangeSuccess event
                            // and would resolve promise when this event occurs.
                            $rootScope.$on('$locationChangeSuccess', function (next, current) {
                                deferred.resolve();
                            });
                        };

                    deferred.promise.then(function () {
                        if (title != undefined) {
                            $rootScope.title = title;
                        }
                        authorized.resolve();
                    }, function () {
                        /// redirect to not authorized page
                        redirect('/not-authorized');
                    });

                    if (isPublic) {
                        deferred.resolve();
                    } else {
                        if (session.init()) {
                            if (session.hasViewPermission(path)) {
                                deferred.resolve();
                            } else {
                                /// redirect to not authorized page
                                deferred.reject();
                            }
                        } else {
                            // In that case, it is necessary to load the user from session
                            authorizationSvc.getCurrent(function (data) {
                                if (session.init(data)) {
                                    if (session.hasViewPermission(path)) {
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
                                redirect('/login');
                            });
                        }
                    }
                    return authorized.promise;
                }]
            };

        };

    });
})();