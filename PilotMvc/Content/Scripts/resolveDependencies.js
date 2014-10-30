(function () {
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (iterationCall) {
            for (var i = 0, len = this.length; i < len; i++) {
                iterationCall(this[i], i, this);
            }
        }
    }
    var definitions = [];
    define([], function () {
        return function (dependencies) {
            return {
                load: ['$q', '$rootScope', function ($q, $rootScope) {
                    var deferred = $q.defer(), dependenciesNotLoaded = [];
                    dependencies.forEach(function (val) {
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
                }]
            };
        };
    });
})();