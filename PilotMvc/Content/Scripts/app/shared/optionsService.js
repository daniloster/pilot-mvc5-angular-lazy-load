(function() {
    var Svc = null;
    define(['app'], function (app) {
        if (Svc == null) {
            Svc = ['$http', function ($http) {

                var resource = {
                    getAvailableApps: function (success, error) {
                        $http.post('/application/available-by-user').success(success).error(error);
                    },
                    getAllResourceTypes: function (success, error) {
                        $http.post('/resource/types').success(success).error(error);
                    },
                    getAvailableRoles: function (success, error) {
                        $http.post('/role/available-by-user').success(success).error(error);
                    },
                    getAvailableUsers: function (success, error) {
                        $http.post('/user/available-by-user').success(success).error(error);
                    }
                };
                
                return resource;
            }];
            app.lazy.factory('OptionsService', Svc);
        }
    });
})();