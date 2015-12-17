define([], function () {
    return [
        {
            state: 'assign-roles',
            options: {
                url: '^/assign-roles',
                templateUrl: '/$base.app.dest/modules/assignRoles/assign-roles.html',
                data: {
                    dependencies: [
                        'components/common/modal/dialog',
                        'components/common/pagination/pagination'
                    ],
                    isPublic: true,
                    title: 'Pilot MVC | Assign Roles'
                }
            }
        },
        {
            state: 'assign-roles.based-on-role',
            options: {
                url: '/based-on-role',
                templateUrl: '/$base.app.dest/modules/assignRoles/assign-roles-based-on-role.html',
                data: {
                    dependencies: [
                        'modules/assignRoles/roleBasedAssignmentController',
                        'modules/assignRoles/roleBasedAssignmentService',
                        'components/common/modal/dialog',
                        'components/common/pagination/pagination'
                    ],
                    isPublic: true,
                    title: 'Pilot MVC | Assign Roles'
                }
            }
        },
        {
            state: 'assign-roles.based-on-user',
            options: {
                url: '/based-on-user',
                templateUrl: '/$base.app.dest/modules/assignRoles/assign-roles.html',
                data: {
                    dependencies: [
                        'modules/assignRoles/userBasedAssignmentController',
                        'components/common/modal/dialog',
                        'components/common/pagination/pagination'
                    ],
                    isPublic: true,
                    title: 'Pilot MVC | Assign Roles'
                }
            }
        }
    ];
});