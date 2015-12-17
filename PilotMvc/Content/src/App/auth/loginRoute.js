define([], function () {
    return [
        {
            state: 'login',
            options: {
                url: '^/login',
                templateUrl: '/$base.app.dest/auth/login.html',
                data: {
                    dependencies: [
                        'components/common/form/checkbox/checkbox',
                        'components/common/form/password/password'
                    ],
                    isPublic: true,
                    title: 'Pilot MVC | Login'
                }
            }
        }
    ];
});