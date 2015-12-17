(function () {
    var loaded = false,
    //Cache of the dependencies loaded
    //@type dependencies <Array<String>>
    definitions = [];

    function DependencyResolverProvider() {
        this.$get = ['$q', '$rootScope', '$state', '$timeout', 'LoadingService', 'data',
        function ($q, $rootScope, $state, $timeout, loadingService, data) {

            var deferred = $q.defer(), dependenciesNotLoaded = [];
            loadingService.startLoading();

            if (data.dependencies !== undefined) {
                data.dependencies.forEach(function (val) {
                    if (definitions.indexOf(val) < 0) {
                        definitions.push(val);
                        dependenciesNotLoaded.push(val);
                    }
                });
                if (dependenciesNotLoaded.length) {
                    // Load the dependencies
                    require(dependenciesNotLoaded, function () {
                        // all dependencies have now been loaded by so resolve the promise
                        $rootScope.$apply(function () {
                            deferred.resolve(true);
                            loadingService.stopLoading();
                        }, function () {
                            loadingService.stopLoading();
                        });
                    });
                } else {
                    deferred.resolve(true);
                    loadingService.stopLoading();
                }
            }
            else {
                deferred.resolve(true);
                loadingService.stopLoading();
            }
            return deferred.promise;
        }];
    }

    define(['app', 'components/common/loading/loadingService'], function (app) {
        if (!loaded) {
            loaded = true;
            app.lazy.provider('DependencyResolver', DependencyResolverProvider);
        }
    });
})();




