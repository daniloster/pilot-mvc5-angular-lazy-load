define([], function () {
    return [
        {
            state: 'role',
            options: {
                url: '^/role',
                templateUrl: '/$base.app.dest/modules/role/role.html',
                data: {
                    dependencies: [
                        'modules/role/roleController',
                        'modules/role/roleService',
                        'components/common/modal/dialog',
                        'components/common/pagination/pagination'
                    ],
                    isPublic: false,
                    title: 'Pilot MVC | Role'
                }
            }
        }
    ];
});