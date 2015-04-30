(function() {
    var Svc = null;
    define(['app'], function (app) {
        if (Svc == null) {
            Svc = ['$resource', '$http', 'ConfigApp', function ($resource, $http, ConfigApp) {

                var resource = {
                    register: function (data, success, error) {
                        $http.post(ConfigApp.getPath('/member/register'), data).success(success).error(error);
                    },
                    importAccount: function (data, success, error) {
                        $http.post(ConfigApp.getPath('/member/import-account'), data).success(success).error(error);
                    }
                };
                
                return resource;
            }];
            app.lazy.factory('MembershipService', Svc);
        }
    });
})();