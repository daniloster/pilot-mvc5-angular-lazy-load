(function() {
    var Svc = null;
    define(['app'], function (app) {
        if (Svc == null) {
            Svc = ['$http', function ($http) {

                var resource = {
                    getAssignedUsersByRole: function (data, success, error) {
                        $http.post('/user/assigned-by-role', data).success(success).error(error);
                    },
                    assign: function (data, success, error) {
                        $http.post('/role/assign-role-to-users', data).success(success).error(error);
                    }
                };
                
                return resource;
            }];
            app.lazy.factory('RoleBasedAssignmentService', Svc);
        }
    });
})();