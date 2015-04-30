﻿(function () {
    var definitions = ['auth/UserController'], systemId = 1, redirect = function (routeForUnauthorizedAccess, $location, $rootScope, deferred) {
        //If user does not have required access, we will route the user to unauthorized access page
        $location.path(routeForUnauthorizedAccess);
        //As there could be some delay when location change event happens, 
        //we will keep a watch on $locationChangeSuccess event
        // and would resolve promise when this event occurs.
        $rootScope.$on('$locationChangeSuccess', function (next, current) {
            deferred.resolve();
        });
    }, mustBeMovedToOrderPending = function ($location, user) {

    };
    define(['auth/session'], function (session) {
        return function (dependencies, roles, title) {
            var hasTitle = !!title;
            if (!roles) {
                roles = [];
            }
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

                        if (hasTitle) {
                            $rootScope.title = title;
                        }
                        var deferred = $q.defer();
                        
                        $rootScope.hideBg = ($location.path() != '/login');

                        if ($location.path() == '/login' || roles.length == 0) {
                            deferred.resolve();
                        } else {
                            if (session.init()) {
                                var user = session.getUserLogged($cookieStore);
                                /*if (user.ForcePayPendingOrder == true || user.ForcePayPendingOrder == "true") {
                                    /// redirect to pending order
                                    redirect('/my-order/' + user.PendingOrder.Id, $location, $rootScope, deferred);
                                } else*/
                                if (session.hasPermission(roles, systemId)) {
                                    deferred.resolve();
                                } else {
                                    /// redirect to not authorized page
                                    redirect('/not-authorized', $location, $rootScope, deferred);
                                }
                            } else {
                                // In that case, it is necessary to load the user from session
                                authorizationSvc.getCurrent(function (data) {
                                    if (session.init($cookieStore, data)) {
                                        var user = session.getUserLogged($cookieStore);
                                        if (session.hasPermission(roles, systemId)) {
                                            deferred.resolve();
                                        } else /*if (user.ForcePayPendingOrder == true || user.ForcePayPendingOrder == "true") {
                                            /// redirect to pending order
                                            redirect('/my-order/' + user.PendingOrder.Id, $location, $rootScope, deferred);
                                        } else */{
                                            /// redirect to not authorized page
                                            redirect('/not-authorized', $location, $rootScope, deferred);
                                        }
                                    } else {
                                        /// redirect to not authorized page
                                        redirect('/not-authorized', $location, $rootScope, deferred);
                                    }
                                }, function (data) {
                                    /// redirect to login page
                                    redirect('/login', $location, $rootScope, deferred);
                                });
                            }
                        }
                        return deferred.promise;
                    }]
            };
        };
    });
})();