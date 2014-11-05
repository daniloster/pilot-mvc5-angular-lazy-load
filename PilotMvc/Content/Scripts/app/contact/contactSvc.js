(function() {
    var Svc = null;
    define(['app'], function (app) {
        if (Svc == null) {
            Svc = ['$http', function ($http) {
                var factory = function (url) {
                    return function (param, successHandler, errorHandler) {
                        var params = {
                            url: url,
                            method: "POST"
                        }
                        if (arguments.length == 2) {
                            errorHandler = successHandler;
                            successHandler = param;
                        } else {
                            params.data = param;
                        }
                        $http(params).success(successHandler).error(errorHandler);
                    };
                };
                return {
                    query: factory('/contact/query'),
                    create: factory('/contact/create'),
                    delete: factory('/contact/delete'),
                    getContactTypes: factory('/contact/get-contact-types')
                };
            }];

            app.lazy.factory('contactSvc', Svc);
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