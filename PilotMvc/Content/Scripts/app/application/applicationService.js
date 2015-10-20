(function() {
    var Svc = null;
    define(['app'], function (app) {
        if (Svc == null) {
            Svc = ['$http', function ($http) {

                var resource = {
                    query: function (data, success, error) {
                        return $http.post('/application/search', data);
                    },
                    save: function (data, success, error) {
                        return $http.post('/application/save', data);
                    },
                    remove: function (data, success, error) {
                        return $http.post('/application/delete', data);
                    }
                };
                
                return resource;
            }];
            app.lazy.factory('ApplicationService', Svc);
        }
    });
})();