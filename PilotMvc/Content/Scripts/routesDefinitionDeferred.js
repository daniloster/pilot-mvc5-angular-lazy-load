(function (Factory, hasFinished, deferred, notify) {
    notify = function (_deferred, _hasFinished) {
        deferred = _deferred; hasFinished = _hasFinished;
        if (deferred !== undefined) {
            if (hasFinished) {
                deferred.resolve();
            } else {
                deferred.reject();
            }
        }
    };
    define(['app', 'config/dependencyResolver', 'auth/permissionResolver'], function (app) {
        if (Factory === undefined) {
            app.lazy.provider('RoutesDefinitionDeferred', ['DependencyResolverProvider', 'PermissionResolverProvider', (Factory = function routesDefinitionDeferredProvider(dependencyResolverProvider, permissionResolverProvider) {

                this.map = function ($routeProvider) {

                    /* Mapping for authorization features */
                    (function () {
                        $routeProvider
                        .when("/404", resolve({
                            templateUrl: '/Content/Scripts/app/shared/access/404.html',
                            dependencies: ['auth/authorizationController',
                                'components/app/menu/menu',
                                'components/common/form/statusMessage',
                                'components/common/loading/loading'],
                            isPublic: true,
                            title: '404 | Mojo Management System'
                        }))
                        .when("/500", resolve({
                            templateUrl: '/Content/Scripts/app/shared/access/500.html',
                            dependencies: ['auth/authorizationController',
                                'components/app/menu/menu',
                                'components/common/form/statusMessage',
                                'components/common/loading/loading'],
                            isPublic: true,
                            title: '500 | Mojo Management System'
                        }))
                        .when("/not-authorized", resolve({
                            templateUrl: '/Content/Scripts/app/shared/access/not-authorized.html',
                            dependencies: ['auth/authorizationController',
                                'components/app/menu/menu',
                                'components/common/form/statusMessage',
                                'components/common/loading/loading'],
                            isPublic: true,
                            title: 'You are fucked and not authorized!'
                        }))
                        .when("/login", resolve({
                            templateUrl: '/Content/Scripts/auth/login.html',
                            dependencies: ['auth/authorizationController',
                                'components/common/form/checkbox/checkbox',
                                'components/common/form/password/password',
                                'components/app/menu/menu',
                                'components/common/form/statusMessage',
                                'components/common/loading/loading'],
                            isPublic: true,
                            title: 'Login | Mojo Management System'
                        }));
                    })();

                    /* Mapping for dashboard and features */
                    (function () {
                        $routeProvider
                        .when("/", resolve({
                            templateUrl: '/Content/Scripts/app/shared/dashboard.html',
                            dependencies: ['auth/authorizationController',
                                'components/app/menu/menu',
                                'components/common/form/statusMessage',
                                'components/common/loading/loading'],
                            isPublic: true,
                            title: 'Pilot | Dashboard'
                        }))
                        .when("/application", resolve({
                            templateUrl: '/Content/Scripts/app/application/application.html',
                            dependencies: ['auth/authorizationController',
                                'components/app/menu/menu',
                                'components/common/form/statusMessage',
                                'components/common/modal/dialog',
                                'components/common/pagination/pagination',
                                'components/common/loading/loading',
                                'app/application/applicationController'],
                            isPublic: true,
                            title: 'Pilot | Managing Applications'
                        }))
                        .when("/resource", resolve({
                            templateUrl: '/Content/Scripts/app/resource/resource.html',
                            dependencies: ['auth/authorizationController',
                                'components/app/menu/menu',
                                'components/common/form/statusMessage',
                                'components/common/modal/dialog',
                                'components/common/pagination/pagination',
                                'components/common/loading/loading',
                                'app/resource/resourceController'],
                            isPublic: true,
                            title: 'Pilot | Managing Resources'
                        }))
                        .when("/role", resolve({
                            templateUrl: '/Content/Scripts/app/role/role.html',
                            dependencies: ['auth/authorizationController',
                                'components/app/menu/menu',
                                'components/common/form/statusMessage',
                                'components/common/modal/dialog',
                                'components/common/pagination/pagination',
                                'components/common/loading/loading',
                                'app/role/roleController'],
                            isPublic: true,
                            title: 'Pilot | Managing Roles'
                        }))
                        .when("/user", resolve({
                            templateUrl: '/Content/Scripts/app/user/user.html',
                            dependencies: ['auth/authorizationController',
                                'components/app/menu/menu',
                                'components/common/form/statusMessage',
                                'components/common/form/customValidation',
                                'components/common/modal/dialog',
                                'components/common/pagination/pagination',
                            'components/common/loading/loading',
                                'app/user/userController'],
                            isPublic: true,
                            title: 'Pilot | Managing Users'
                        }))
                        .when("/assign-roles", resolve({
                            templateUrl: '/Content/Scripts/app/assignRoles/assign-roles.html',
                            dependencies: ['auth/authorizationController',
                                'components/app/menu/menu',
                                'components/common/form/statusMessage',
                                'components/common/form/customValidation',
                            'components/common/loading/loading'],
                            isPublic: true,
                            title: 'Pilot | Assigning Roles'
                        }))
                        .when("/assign-roles/based-on-role", resolve({
                            templateUrl: '/Content/Scripts/app/assignRoles/assign-roles-based-on-role.html',
                            dependencies: ['auth/authorizationController',
                                'components/app/menu/menu',
                                'components/common/form/statusMessage',
                                'components/common/form/customValidation',
                                'components/common/dropList/dropList',
                            'components/common/loading/loading',
                            'app/assignRoles/roleBasedAssignmentController'],
                            isPublic: true,
                            title: 'Pilot | Assigning Roles'
                        }))
                        .when("/assign-roles/based-on-user", resolve({
                            templateUrl: '/Content/Scripts/app/assignRoles/assign-roles-based-on-user.html',
                            dependencies: ['auth/authorizationController',
                                'components/app/menu/menu',
                                'components/common/form/statusMessage',
                                'components/common/form/customValidation',
                                'components/common/dropList/dropList',
                            'components/common/loading/loading',
                            'app/assignRoles/userBasedAssignmentController'],
                            isPublic: true,
                            title: 'Pilot | Assigning Roles'
                        }));
                    })();

                    /* Mapping for reports */
                    (function () {
                    })();

                    $routeProvider.otherwise({
                        redirectTo: '/404'
                    });


                    notify(deferred, true);
                };

                function resolve(data) {
                    /*
                    Dependencies must be feeded as requirejs syntax.
                    */
                    //@type dependencies <Array<String>>
                    data.dependencies = data.dependencies || [],
                    //@type isPublic <Booelan>
                    data.isPublic = data.isPublic || (data.isPublic === undefined),
                    //@type title <String>
                    data.title = data.title || undefined;
                    data.resolve = data.resolve || {};
                    data.resolve.load = data.resolve.load || dependencyResolverProvider.$get;
                    data.resolve.permission = data.resolve.permission || permissionResolverProvider.defineResolver('global');
                    return data;
                }

                this.$get = ['$q', function routesDefinitionDeferredFactory($q) {
                    notify($q.defer(), hasFinished);
                    return deferred.promise;
                }];
            })]);
        }

        return Factory;
    });
})();