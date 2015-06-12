(function () {
    define(['resolve'], function (resolve) {
        return function ($routeProvider) {

            $routeProvider
                    .when("/404", {
                        templateUrl: '/Content/Partials/access/404.html',
                        resolve: resolve({
                            dependencies: ['auth/authorizationController',
                                'components/app/navMenu/menu'],
                            isPublic: true
                        })
                    })
                    .when("/not-authorized", {
                        templateUrl: '/Content/Partials/access/not-authorized.html',
                        resolve: resolve({
                            dependencies: ['auth/authorizationController',
                                'components/app/navMenu/menu'],
                            isPublic: true,
                            title: 'You are fucked and not authorized!'
                        })
                    })

                    .when("/login", {
                        templateUrl: '/Content/Partials/access/login.html',
                        resolve: resolve({
                            dependencies: ['auth/authorizationController',
                                'components/app/navMenu/menu'],
                            isPublic: true,
                            title: 'Wonderful login page'
                        })
                    })
                    .when("/", {
                        templateUrl: '/Content/Partials/dashboard.html',
                        resolve: resolve({
                            dependencies: ['auth/authorizationController',
                                'components/app/navMenu/menu'],
                            isPublic: false,
                            title: 'Pilot | Dashboard'
                        })
                    })

                    .when("/application", {
                        templateUrl: '/Content/Partials/application.html',
                        resolve: resolve({
                            dependencies: ['auth/authorizationController',
                                'components/app/navMenu/menu',
                                'components/common/modal/dialog',
                                'components/common/pagination/pagination',
                                'app/application/applicationController'],
                            isPublic: true,
                            title: 'Pilot | Managing Applications'
                        })
                    })
                    .when("/resource", {
                        templateUrl: '/Content/Partials/resource.html',
                        resolve: resolve({
                            dependencies: ['auth/authorizationController',
                                'components/app/navMenu/menu',
                                'components/common/modal/dialog',
                                'components/common/pagination/pagination',
                                'app/resource/resourceController'],
                            isPublic: true,
                            title: 'Pilot | Managing Resources'
                        })
                    })
                    .when("/role", {
                        templateUrl: '/Content/Partials/role.html',
                        resolve: resolve({
                            dependencies: ['auth/authorizationController',
                                'components/app/navMenu/menu',
                                'components/common/modal/dialog',
                                'components/common/pagination/pagination',
                                'app/role/roleController'],
                            isPublic: true,
                            title: 'Pilot | Managing Roles'
                        })
                    })

                    .otherwise({
                        redirectTo: '/404'
                    });

        };
    });
})();