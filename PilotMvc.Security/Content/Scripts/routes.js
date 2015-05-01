(function () {
    define(['routes', 'resolve'], function (routes, resolve) {
        return function ($routeProvider) {

            $routeProvider
                    .when("/404", {
                        templateUrl: '/Content/Partials/404.html',
                        isPublic: true,
                        title: 'Pilot Sec | Are you trying to mock me? Page not found!'
                    })
                    .when("/not-authorized", {
                        templateUrl: '/Content/Partials/not-authorized.html',
                        isPublic: true,
                        title: 'Pilot Sec | You are fucked and not authorized!'
                    })

                    .when("/login", {
                        templateUrl: '/Content/Partials/login.html',
                        resolve: resolve({
                            dependencies: ['auth/userController'],
                            isPublic: true,
                            title: 'Pilot Sec | Wonderful login page'
                        })
                    })
                    .when("/", {
                        templateUrl: '/Content/Partials/dashboard.html',
                        resolve: resolve({
                            dependencies: ['app/dashboard/dashboardController'],
                            isPublic: false,
                            title: 'Pilot Sec | Amazing dashboard'
                        })
                    })
                    .when("/member", {
                        templateUrl: '/Content/Partials/member.html',
                        resolve: resolve({
                            dependencies: ['app/member/memberController',
                            'components/common/pagination/pagination'],
                            isPublic: false,
                            title: 'Members fucking awesome!!!'
                        })
                    })
                    .when("/contact", {
                        templateUrl: '/Content/Partials/contact.html',
                        resolve: resolve({
                            dependencies: ['app/contact/contactController',
                            'components/common/pagination/pagination',
                            'components/common/fileUpload/fileUpload'],
                            isPublic: false,
                            title: 'Contact rules!!!'
                        })
                    })
                    .otherwise({
                        redirectTo: '/404'
                    });

        };
    });
})();