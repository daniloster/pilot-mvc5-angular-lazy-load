(function() {
    var Svc = null;
    define(['app'], function (app) {
        if (Svc == null) {
            Svc = ['$http', function ($http) {

                var resource = {
                    query: function (data, success, error) {
                        return $http.post('/resource/search', data);
                    },
                    save: function (data, success, error) {
                        return $http.post('/resource/save', data);
                    },
                    remove: function (data, success, error) {
                        return $http.post('/resource/delete', data);
                    }
                };
                
                return resource;
            }];
            app.lazy.factory('ResourceService', Svc);
        }
    });
})();