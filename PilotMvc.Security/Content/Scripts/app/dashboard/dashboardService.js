(function() {
    var Svc = null;
    define(['app'], function (app) {
        if (Svc == null) {
            Svc = ['$http', function ($http) {

                var resource = {
                    getStats: function (success, error) {
                        $http.post('/dashboard/stats').success(success).error(error);
                    }
                };
                
                return resource;
            }];
            app.lazy.factory('DashboardService', Svc);
        }
    });
})();