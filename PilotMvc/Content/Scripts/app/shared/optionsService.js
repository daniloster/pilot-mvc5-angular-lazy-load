(function() {
    var Svc = null, resource = null;
    define(['app'], function (app) {
        if (Svc == null) {
            Svc = ['$injector', function ($injector) {
                if (resource == null) {
                    var $http = $injector.$get('$http');
                    resource = {
                        getAvailableApps: function (success, error) {
                            return $http.post('/application/available-by-user');
                        },
                        getAllResourceTypes: function (success, error) {
                            return $http.post('/resource/types');
                        },
                        getAvailableRoles: function (success, error) {
                            return $http.post('/role/available-by-user');
                        },
                        getAvailableUsers: function (success, error) {
                            return $http.post('/user/available-by-user');
                        }
                    };
                }
                
                return resource;
            }];
            app.lazy.factory('OptionsService', Svc);
        }
    });
})();