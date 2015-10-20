(function() {
    var Svc = null;
    define(['app'], function (app) {
        if (Svc == null) {
            Svc = ['$http', function ($http) {

                var resource = {
                    query: function (data, success, error) {
                        return $http.post('/user/search', data);
                    },
                    save: function (data, success, error) {
                        return $http.post('/user/save', data);
                    },
                    remove: function (data, success, error) {
                        return $http.post('/user/delete', data);
                    }
                };
                
                return resource;
            }];
            app.lazy.factory('UserService', Svc);
        }
    });
})();