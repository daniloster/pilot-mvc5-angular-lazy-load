(function () {    
    var Factory = null,
    //Cache of the dependencies loaded
    //@type dependencies <Array<String>>
    definitions = [];
    define(['app'], function (app) {
        if (Factory == null) {

            app.lazy.provider('DependencyResolver', (Factory = function dependencyResolverProvider() {
                this.$get = ['$q', '$rootScope', '$route', function ($q, $rootScope, $route) {
                
                    var deferred = $q.defer(), dependenciesNotLoaded = [];
                    $route.current.dependencies.forEach(function (val) {
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
                                deferred.resolve();
                            });
                        });
                    } else {
                        deferred.resolve();
                    }
                    return deferred.promise;
                }];
            }));
        }

        return Factory;
    });
})();




