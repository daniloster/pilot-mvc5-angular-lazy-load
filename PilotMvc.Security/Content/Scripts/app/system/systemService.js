(function() {
    var Svc = null;
    define(['app'], function (app) {
        if (Svc == null) {
            Svc = ['$http', function ($http) {

                var resource = {
                    save: function (data, success, error) {
                        $http.post('/system/save', data).success(success).error(error);
                    },
                    'delete': function (data, success, error) {
                        $http.post('/system/delete', data).success(success).error(error);
                    },
                    getByFilter: function (data, success, error) {
                        $http.post('/system/by-filter', !!data ? data : {}).success(success).error(error);
                    }
                };
                
                return resource;
            }];
            app.lazy.factory('SystemService', Svc);
        }
    });
})();