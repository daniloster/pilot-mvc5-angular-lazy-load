(function() {
    var Svc = null;
    define(['app'], function (app) {
        if (Svc == null) {
            Svc = ['$resource', '$http', function ($resource, $http) {

                var resource = {
                    beta: $resource('/api/member-beta/:Id', {}, {
                        query: { method: 'GET', params: { Id: '' }, isArray: true },
                        create: { method: 'POST', params: { Id: '' } },
                        update: { method: 'PUT', params: { Id: '@Id' } },
                        delete: { method: 'DELETE', params: { Id: '@Id' } }
                    }),
                    test: {
                        method1: function (param, successHandler, errorHandler) {
                            $http({
                                url: '/member/send-test',
                                method: "POST",
                                data: param
                            }).success(successHandler).error(errorHandler);
                        },
                        method2: function (param, successHandler, errorHandler) {
                            $http({
                                url: '/member/send-test2',
                                method: "POST",
                                data: param
                            }).success(successHandler).error(errorHandler);
                        }
                    },
                    query: function (success, error) {
                        $http.post('/member/all').success(success).error(error);
                    },
                    create: function (data, success, error) {
                        $http.post('/member/save', data).success(success).error(error);
                    },
                    update: function (data, success, error) {
                        $http.post('/member/save', data).success(success).error(error);
                    },
                    delete: function (data, success, error) {
                        $http.post('/member/delete', data).success(success).error(error);
                    }
                };
                
                return resource;
            }];
            //<instance>.test({LastName: "Castro"}, function(data) { console.log(data); }, function(data) { console.log(data); } });
            app.lazy.factory('MemberService', Svc);
        }
    });
})();

/*
return $resource('/api/member/:Id', {} / * Default get with :Id * /, {
query: { method: 'GET', params: { Id: '' }, isArray: true },
create: { method: 'POST' },
update: { method: 'PUT', params: { entryId: '@Id' } },
remove: { method: 'DELETE' }
});

*/