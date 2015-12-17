(function (loaded) {
    PermissionResolver.$inject = ['$injector', '$q', '$state', '$rootScope', 'AuthorizationService', 'LoadingService', 'Session'];
    function PermissionResolver($injector, $q, $state, $rootScope, authorizationService, loadingService, session) {
        var self = this;

        $rootScope.$on('$stateChangeStart', function $stateChangeStart(event, toState, toParams, fromState, fromParams) {
            event.preventDefault();
            if ($rootScope.processingRoute === true) {
                return;
            }
            var a = $injector;
            $rootScope.processingRoute = true;

            loadingService.startLoading();

            var data = toState.data, deferred = $q.defer(), path = $state.href(toState, toParams), redirect,
            /*@type isPublic <Booelan>*/
            isPublic = data.isPublic || (data.isPublic == undefined),
            /*@type title <String>*/
            title = data.title || undefined;

            redirect = function (stateForUnauthorizedAccess, toParams) {
                //If user does not have required access, we will route the user to unauthorized access page
                //$location.path(routeForUnauthorizedAccess);
                $rootScope.processingRoute = false;
                //As there could be some delay when location change event happens, 
                //we will keep a watch on $locationChangeSuccess event
                // and would resolve promise when this event occurs.
                $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                    deferred.resolve();
                });
                $state.go(stateForUnauthorizedAccess);
            }

            deferred.promise.then(function () {
                if (title !== undefined) {
                    $rootScope.title = title;
                }
                $rootScope.$userNavigation.saveState();
                loadingService.stopLoading();
                if ($rootScope.AuthorizedUser === undefined) {
                    authorizationService.getCurrent(function () { }, function () { });
                }
                $rootScope.processingRoute = false;
            }, function (stateToGo) {
                loadingService.stopLoading();
                /// redirect to not authorized page
                redirect(stateToGo);
            });

            if (!!isPublic) {
                deferred.resolve();
                return true;
            } else {
                if (session.init()) {
                    if (session.hasViewPermission(path)) {
                        deferred.resolve();
                        return true;
                    } else {
                        /// redirect to not authorized page
                        deferred.reject('not-authorized');
                    }
                } else {
                    deferred.reject('login');
                    // In that case, it is necessary to load the user from session
                    //authorizationService.getCurrent()
                    //.success(function (data) {
                    //    if (session.init(data) && session.hasViewPermission(path)) {
                    //        deferred.resolve();
                    //    } else {
                    //        /// redirect to not authorized page
                    //        deferred.reject('not-authorized');
                    //    }
                    //})
                    //.error(function (data) {
                    //    /// redirect to login page
                    //    deferred.reject('login');
                    //});
                }
            }
        });
    }

    define(['app', 'jq', 'auth/session', 'components/common/loading/loadingService', 'config/userNavigation'], function (app, $) {
        if (!loaded) {
            loaded = true;
            app.run(PermissionResolver);
        }
    });
})();




