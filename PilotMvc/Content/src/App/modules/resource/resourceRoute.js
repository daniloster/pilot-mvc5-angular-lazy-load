define([], function () {
    return [
        {
            state: 'resource',
            options: {
                url: '^/resource',
                templateUrl: '/$base.app.dest/modules/resource/resource.html',
                data: {
                    dependencies: [
                        'modules/resource/resourceController',
                        'modules/resource/resourceService',
                        'components/common/modal/dialog',
                        'components/common/pagination/pagination'
                    ],
                    isPublic: false,
                    title: 'Pilot MVC | Resource'
                }
            }
        }
    ];
});