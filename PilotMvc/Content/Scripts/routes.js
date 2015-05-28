(function () {
    define(['resolve'], function (resolve) {
        return function ($routeProvider) {

            $routeProvider
                    .when("/404", {
                        templateUrl: '/Content/Partials/404.html',
                        resolve: resolve({
                            dependencies:['components/app/navMenu/menu'],
                            isPublic: true
                        })
                    })
                    .when("/not-authorized", {
                        templateUrl: '/Content/Partials/not-authorized.html',
                        resolve: resolve({
                            dependencies: ['components/app/navMenu/menu'],
                            isPublic: true,
                            title: 'You are fucked and not authorized!'
                        })
                    })

                    .when("/login", {
                        templateUrl: '/Content/Partials/login.html',
                        resolve: resolve({
                            dependencies: ['auth/authorizationController',
                                'components/app/navMenu/menu'],
                            isPublic: true,
                            title: 'Wonderful login page'
                        })
                    })
                    .when("/", {
                        templateUrl: '/Content/Partials/home.html',
                        resolve: resolve({
                            dependencies: ['auth/authorizationController',
                                'components/app/navMenu/menu',
                                'components/common/date/datePicker',
                                'app/home/homeController'],
                            isPublic: false,
                            title: 'Home is like a Dashboard'
                        })
                    })
                    .when("/member", {
                        templateUrl: '/Content/Partials/member.html',
                        resolve: resolve({
                            dependencies: ['app/member/memberController',
                                'components/app/navMenu/menu',
                                'components/common/pagination/pagination'],
                            isPublic: false,
                            title: 'Members fucking awesome!!!'
                        })
                    })
                    .when("/contact", {
                        templateUrl: '/Content/Partials/contact.html',
                        resolve: resolve({
                            dependencies: ['app/contact/contactController',
                                'components/app/navMenu/menu',
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