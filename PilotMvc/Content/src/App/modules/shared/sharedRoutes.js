define([], function () {
    return [
        {
            state: '404',
            options: {
                url: '^/404',
                templateUrl: '/$base.app.dest/modules/shared/access/404.html',
                data: {
                    dependencies: ['auth/authorizationController'],
                    isPublic: true,
                    title: '404 | Pilot MVC'
                }
            }
        },{
            state: '500',
            options: {
                url: '^/500',
                templateUrl: '/$base.app.dest/modules/shared/access/500.html',
                data: {
                    dependencies: ['auth/authorizationController'],
                    isPublic: true,
                    title: '500 | Pilot MVC'
                }
            }
        },{
            state: 'not-authorized',
            options: {
                url: '^/not-authorized',
                templateUrl: '/$base.app.dest/modules/shared/access/not-authorized.html',
                data: {
                    dependencies: ['auth/authorizationController'],
                    isPublic: true,
                    title: 'You are fucked and not authorized!'
                }
            }
        },
        {
            state: 'dashboard',
            options: {
                url: '^/dashboard',
                templateUrl: '/$base.app.dest/modules/shared/dashboard.html',
                data: {
                    dependencies: ['auth/authorizationController'],
                    isPublic: false,
                    title: 'Pilot MVC | Dashboard'
                }
            }
        }
    ];
});