(function() {
    var Svc = null;
    define(['app'], function (app) {
        if (Svc == null) {
            Svc = ['$resource', '$http', function ($resource, $http) {
                var resource = $resource('/api/member/:Id', {}, {
                    query: { method: 'GET', params: { Id: '' }, isArray: true },
                    create: { method: 'POST', params: { Id: '' } },
                    update: { method: 'PUT', params: { Id: '@Id' } },
                    delete: { method: 'DELETE', params: { Id: '@Id' } }
                });

                resource.test = function (param, successHandler, errorHandler) {
                    $http({
                        url: '/member-test/send-test',
                        method: "POST",
                        data: param
                    }).success(successHandler).error(errorHandler);
                };

                resource.test2 = function (param, successHandler, errorHandler) {
                    $http({
                        url: '/member-test/send-test2',
                        method: "POST",
                        data: param
                    }).success(successHandler).error(errorHandler);
                };

                return resource;
            }];
            //<instance>.test({LastName: "Castro", function(data) { console.log(data); }, function(data) { console.log(data); } });
            app.lazy.factory('memberSvc', Svc);
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