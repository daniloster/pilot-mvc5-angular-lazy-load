(function() {
    var MemberSvc = null;
    define(['app'], function (app) {
        if (MemberSvc == null) {
            MemberSvc = ['$resource', '$http', function ($resource, $http) {
                return $resource('/api/member/:Id', {}, {
                    query: { method: 'GET', params: { Id: '' }, isArray: true },
                    create: { method: 'POST', params: { Id: '' } },
                    update: { method: 'PUT', params: { Id: '@Id' } },
                    delete: { method: 'DELETE', params: { Id: '@Id' } }
                });
            }];
            MemberSvc.name = 'MemberSvc';

            //MemberSvc.updateTotalMembers = function (param, successHandler, errorHandler) {
            //    $http({
            //        url: '/index/update-total-members',
            //        method: "POST",
            //        data: param
            //    }).success(function (data) {
            //        //$scope.master = angular.copy(message);
            //        //$scope.master = data;
            //          successHandler(data);
            //    }).error(function (data) {
            //        //$scope.master = { message: "failed" }
            //          errorHandler(data);
            //    });
            //};
            // <instance>.updateTotalMembers({LastName: "Castro", function(data) { console.log(data); }, function(data) { console.log(data); } });
            app.lazy.factory(MemberSvc.name, MemberSvc);
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