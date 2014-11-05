(function() {
    var Svc = null;
    define(['angular', 'app'], function (angular, app) {
        if (Svc == null) {
            Svc = ['$http', function ($http) {

                return {
                    sendFile: function(file, successHandler, errorHandler) {
                        var fd = new FormData();
                        //Take the first selected file
                        fd.append("file", file);
                        $http.post('/upload/file', fd, {
                            withCredentials: true,
                            headers: {'Content-Type': undefined },
                            transformRequest: angular.identity
                        }).success(successHandler).error(errorHandler);
                        /// SUCCESS : { 
                        //    FileName: "",
                        //    Size: 0
                        //}
                    }
                };
            }];

            app.lazy.factory('uploadSvc', Svc);
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