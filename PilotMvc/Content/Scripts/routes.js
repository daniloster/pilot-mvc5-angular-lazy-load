(function () {
    define(['routes', 'resolve', 'auth/roles'], function (routes, resolve, roles) {
        return function ($routeProvider) {

            $routeProvider
                    .when("/", {
                        templateUrl: '/Content/Partials/home.html',
                        resolve: resolve({
                            dependencies: ['app/home/homeController'],
                            permission: [roles.Admin, roles.Member, roles.Guest],
                            title: 'Home is like a Dashboard'
                        })
                    })
                    .when("/not-authorized", {
                        templateUrl: '/Content/Partials/not-authorized.html',
                        title: 'You are fucked and not authorized!'
                    })
                    .when("/login", {
                        templateUrl: '/Content/Partials/login.html',
                        resolve: resolve({
                            dependencies: ['auth/userController'],
                            title: 'Wonderful login page'
                        })
                    })
                    .when("/404", {
                        templateUrl: '/Content/Partials/404.html'
                    })
                    .when("/member", {
                        templateUrl: '/Content/Partials/member.html',
                        resolve: resolve({
                            dependencies: ['app/member/memberController',
                            'components/common/pagination/pagination'],
                            permission: [roles.Admin, roles.Member],
                            title: 'Members fucking awesome!!!'
                        })
                    })
                    .when("/contact", {
                        templateUrl: '/Content/Partials/contact.html',
                        resolve: resolve({
                            dependencies: ['app/contact/contactController',
                            'components/common/pagination/pagination',
                            'components/common/fileUpload/fileUpload'],
                            permission: [roles.Admin, roles.Member],
                            title: 'Contact rules!!!'
                        })
                    })
                    .otherwise({
                        redirectTo: '/404'
                    });

        };
    });
})();