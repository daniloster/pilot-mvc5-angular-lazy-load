(function() {
    var Svc = null;
    define(['app'], function (app) {
        if (Svc == null) {
            Svc = ['$http', function ($http) {

                var resource = {
                    login: function (success, error) {
                        $http.post('/member/all').success(success).error(error);
                    }
                };
                
                return resource;
            }];
            app.lazy.factory('homeSvc', Svc);
        }
    });
})();