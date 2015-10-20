(function() {
    var Svc = null;
    define(['app'], function (app) {
        if (Svc == null) {
            Svc = ['$http', function ($http) {

                var resource = {
                    getAssignedUsersByRole: function (data, success, error) {
                        return $http.post('/user/assigned-by-role', data);
                    },
                    assign: function (data, success, error) {
                        return $http.post('/role/assign-role-to-users', data);
                    }
                };
                
                return resource;
            }];
            app.lazy.factory('RoleBasedAssignmentService', Svc);
        }
    });
})();