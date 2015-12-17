define([], function () {
    return [
        {
            state: 'user',
            options: {
                url: '^/user',
                templateUrl: '/$base.app.dest/modules/user/user.html',
                data: {
                    dependencies: [
                        'modules/user/userController',
                        'modules/user/userService',
                        'components/common/modal/dialog',
                        'components/common/pagination/pagination'
                    ],
                    isPublic: false,
                    title: 'Pilot MVC | User'
                }
            }
        }
    ];
});