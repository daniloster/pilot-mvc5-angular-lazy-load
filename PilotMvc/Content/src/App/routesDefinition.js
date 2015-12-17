(function (loaded, mappings, routes) {
    loaded = false;
    mappings = [];
    RoutesDefinitionProvider.$inject = ['DependencyResolverProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider'];
    function RoutesDefinitionProvider(dependencyResolverProvider, $locationProvider, $stateProvider, $urlRouterProvider) {
        var coreDependencies = [
            'auth/authorizationController',
            'components/app/menu/menu',
            'components/common/form/statusMessage'
        ];

        if (appSettings.handleRoutes) {
            // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
            $urlRouterProvider.otherwise('/404');
            // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
            // Here we are just setting up some convenience urls.
            $urlRouterProvider.when('', '/dashboard');
            $urlRouterProvider.when('/', '/dashboard');

            mappings.forEach(function (mapping) {
                $stateProvider.state(mapping.state, resolve(mapping.options));
            });
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
        }

        function resolve(options) {
            options.resolve = options.resolve || {};
            options.resolve.load = options.resolve.load || dependencyResolverProvider.$get;
            /*
            Dependencies must be feeded as requirejs syntax.
            */
            //@type dependencies <Array<String>>
            options.resolve.data = ['$q', function ($q) {
                var defered = $q.defer(), data;
                data = JSON.parse(JSON.stringify(options.data));
                //@type isPublic <Booelan>
                data.isPublic = options.data.isPublic || (options.data.isPublic === undefined);
                //@type title <String>
                data.title = options.data.title || undefined;
                data.dependencies = coreDependencies.concat(options.data.dependencies || []);
                defered.resolve(options.data);
                return defered.promise;
            }];
            options.resolve.user = ['AuthorizationService', function (authorizationService) {
                return authorizationService.getCurrent();
            }];
            return options;
        }

        this.$get = [function () {
            return {};
        }];
    }

    routes = [
        'auth/loginRoute',
        'modules/shared/sharedRoutes',
        'modules/application/applicationRoute',
        'modules/assignRoles/assignRolesRoutes',
        'modules/resource/resourceRoute',
        'modules/role/roleRoute',
        'modules/user/userRoute'
    ];
    define(['app', 'config/dependencyResolver', 'auth/permissionResolver'].concat(appSettings.handleRoutes ? routes : []), function (app) {
        if (!loaded) {
            loaded = true;

            if (appSettings.handleRoutes) {
                routes.forEach(function (pathMapping) {
                    mappings = mappings.concat(require(pathMapping));
                });
            }

            app.lazy.provider('RoutesDefinition', RoutesDefinitionProvider);
        }
    });
})();