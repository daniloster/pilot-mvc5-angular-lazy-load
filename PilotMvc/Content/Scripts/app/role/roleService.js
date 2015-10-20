(function() {
    var Svc = null;
    define(['app'], function (app) {
        if (Svc == null) {
            Svc = ['$http', function ($http) {

                var resource = {
                    query: function (data, success, error) {
                        return $http.post('/role/search', data);
                    },
                    save: function (data, success, error) {
                        return $http.post('/role/save', data);
                    },
                    remove: function (data, success, error) {
                        return $http.post('/role/delete', data);
                    }
                };
                
                return resource;
            }];
            app.lazy.factory('RoleService', Svc);
        }
    });
})();