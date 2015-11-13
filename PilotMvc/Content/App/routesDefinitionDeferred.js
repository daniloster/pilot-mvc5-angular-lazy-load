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
                            templateUrl: '/Content/App/modules/shared/access/404.html',
                            dependencies: ['auth/authorizationController',
                                'components/app/menu/menu',
                                'components/common/form/statusMessage',
                                'components/common/loading/loading'],
                            isPublic: true,
                            title: '404 | Mojo Management System'
                        }))
                        .when("/500", resolve({
                            templateUrl: '/Content/App/modules/shared/access/500.html',
                            dependencies: ['auth/authorizationController',
                                'components/app/menu/menu',
                                'components/common/form/statusMessage',
                                'components/common/loading/loading'],
                            isPublic: true,
                            title: '500 | Mojo Management System'
                        }))
                        .when("/not-authorized", resolve({
                            templateUrl: '/Content/App/modules/shared/access/not-authorized.html',
                            dependencies: ['auth/authorizationController',
                                'components/app/menu/menu',
                                'components/common/form/statusMessage',
                                'components/common/loading/loading'],
                            isPublic: true,
                            title: 'You are fucked and not authorized!'
                        }))
                        .when("/login", resolve({
                            templateUrl: '/Content/App/auth/login.html',
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
                            templateUrl: '/Content/App/modules/shared/dashboard.html',
                            dependencies: ['auth/authorizationController',
                                'components/app/menu/menu',
                                'components/common/form/statusMessage',
                                'components/common/loading/loading'],
                            isPublic: true,
                            title: 'Pilot | Dashboard'
                        }))
                        .when("/application", resolve({
                            templateUrl: '/Content/App/modules/application/application.html',
                            dependencies: ['auth/authorizationController',
                                'components/app/menu/menu',
                                'components/common/form/statusMessage',
                                'components/common/modal/dialog',
                                'components/common/pagination/pagination',
                                'components/common/loading/loading',
                                'modules/application/applicationController'],
                            isPublic: false,
                            title: 'Pilot | Managing Applications'
                        }))
                        .when("/resource", resolve({
                            templateUrl: '/Content/App/modules/resource/resource.html',
                            dependencies: ['auth/authorizationController',
                                'components/app/menu/menu',
                                'components/common/form/statusMessage',
                                'components/common/modal/dialog',
                                'components/common/pagination/pagination',
                                'components/common/loading/loading',
                                'modules/resource/resourceController'],
                            isPublic: false,
                            title: 'Pilot | Managing Resources'
                        }))
                        .when("/role", resolve({
                            templateUrl: '/Content/App/modules/role/role.html',
                            dependencies: ['auth/authorizationController',
                                'components/app/menu/menu',
                                'components/common/form/statusMessage',
                                'components/common/modal/dialog',
                                'components/common/pagination/pagination',
                                'components/common/loading/loading',
                                'modules/role/roleController'],
                            isPublic: false,
                            title: 'Pilot | Managing Roles'
                        }))
                        .when("/user", resolve({
                            templateUrl: '/Content/App/modules/user/user.html',
                            dependencies: ['auth/authorizationController',
                                'components/app/menu/menu',
                                'components/common/form/statusMessage',
                                'components/common/form/customValidation',
                                'components/common/modal/dialog',
                                'components/common/pagination/pagination',
                            'components/common/loading/loading',
                                'modules/user/userController'],
                            isPublic: false,
                            title: 'Pilot | Managing Users'
                        }))
                        .when("/assign-roles", resolve({
                            templateUrl: '/Content/App/modules/assignRoles/assign-roles.html',
                            dependencies: ['auth/authorizationController',
                                'components/app/menu/menu',
                                'components/common/form/statusMessage',
                                'components/common/form/customValidation',
                            'components/common/loading/loading'],
                            isPublic: false,
                            title: 'Pilot | Assigning Roles'
                        }))
                        .when("/assign-roles/based-on-role", resolve({
                            templateUrl: '/Content/App/modules/assignRoles/assign-roles-based-on-role.html',
                            dependencies: ['auth/authorizationController',
                                'components/app/menu/menu',
                                'components/common/form/statusMessage',
                                'components/common/form/customValidation',
                                'components/common/dualList/dualList',
                            'components/common/loading/loading',
                            'modules/assignRoles/roleBasedAssignmentController'],
                            isPublic: false,
                            title: 'Pilot | Assigning Roles'
                        }))
                        .when("/assign-roles/based-on-user", resolve({
                            templateUrl: '/Content/App/modules/assignRoles/assign-roles-based-on-user.html',
                            dependencies: ['auth/authorizationController',
                                'components/app/menu/menu',
                                'components/common/form/statusMessage',
                                'components/common/form/customValidation',
                                'components/common/dualList/dualList',
                            'components/common/loading/loading',
                            'modules/assignRoles/userBasedAssignmentController'],
                            isPublic: false,
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