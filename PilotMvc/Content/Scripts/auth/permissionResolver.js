(function (Factory, identification) {
    identification = identification || 0;
    define(['app', 'auth/session'], function (app, session) {
        if (Factory === undefined) {

            app.lazy.provider('PermissionResolver', (Factory = function permissionResolverProvider() {
                var globalActive = true;
                this.defineResolver = function (id) {
                    return ['$q', '$route', '$location', '$rootScope', 'AuthorizationService',
                    function ($q, $route, $location, $rootScope, authorizationService) {
                        var self = this;
                        self.resolve = function () {
                            var deferred = $q.defer(), authorized = $q.defer(), path = $location.path(), redirect,
                            /*@type isPublic <Booelan>*/
                            isPublic = $route.current.isPublic || ($route.current.isPublic == undefined),
                            /*@type title <String>*/
                            title = $route.current.title || undefined;

                            this.activateGlobal = activateGlobal;
                            this.deactivateGlobal = deactivateGlobal;

                            redirect = function (routeForUnauthorizedAccess) {
                                //If user does not have required access, we will route the user to unauthorized access page
                                $location.path(routeForUnauthorizedAccess);
                                //As there could be some delay when location change event happens, 
                                //we will keep a watch on $locationChangeSuccess event
                                // and would resolve promise when this event occurs.
                                $rootScope.$on('$locationChangeSuccess', function (next, current) {
                                    deferred.resolve();
                                });
                            }

                            deferred.promise.then(function () {
                                if (title !== undefined) {
                                    $rootScope.title = title;
                                }
                                authorized.resolve();
                                self.activateGlobal();
                                if ($rootScope.AuthorizedUser === undefined) {
                                    authorizationService.getCurrent(function(){}, function(){});
                                }
                            }, function () {
                                /// redirect to not authorized page
                                redirect('/not-authorized');
                            });

                            if (!!isPublic || (!globalActive && id === 'global')) {
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
                                    authorizationService.getCurrent(function (data) {
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
                            return id === 'global' ? authorized.promise : {
                                activateGlobal: activateGlobal,
                                deactivateGlobal: deactivateGlobal,
                                promise: authorized.promise,
                                resolve: function () {
                                    return self.resolve.apply(self);
                                }
                            };
                        };
                        return self.resolve();
                    }];
                };

                this.$get = this.defineResolver(++identification);

            }));

            function activateGlobal() { globalActive = true; }
            function deactivateGlobal() { globalActive = false; }
        }
    });
})();




