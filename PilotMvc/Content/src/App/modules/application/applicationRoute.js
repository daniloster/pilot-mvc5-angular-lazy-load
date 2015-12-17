define([], function () {
    return [
        {
            state: 'application',
            options: {
                url: '^/application',
                templateUrl: '/$base.app.dest/modules/application/application.html',
                data: {
                    dependencies: [
                        'modules/application/applicationController',
                        'modules/application/applicationService',
                        'components/common/modal/dialog',
                        'components/common/pagination/pagination'
                    ],
                    isPublic: false,
                    title: 'Pilot MVC | Application'
                }
            }
        }
    ];
});