(function() {
    var Svc = null;
    define(['app'], function (app) {
        if (Svc == null) {
            Svc = ['$http', function ($http) {

                var resource = {
                    query: function (data, success, error) {
                        $http.post('/application/search', data).success(success).error(error);
                    },
                    save: function (data, success, error) {
                        $http.post('/application/save', data).success(success).error(error);
                    },
                    'delete': function (data, success, error) {
                        $http.post('/application/delete', data).success(success).error(error);
                    }
                };
                
                return resource;
            }];
            app.lazy.factory('ApplicationService', Svc);
        }
    });
})();