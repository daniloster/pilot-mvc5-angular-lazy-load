(function() {
    var Svc = null;
    define(['angular', 'app'], function (angular, app) {
        if (Svc == null) {
            Svc = ['$rootScope', '$http', '$q', function ($rootScope, $http, $q) {

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
                    },
                    upload: function (files, data, progress, success, error) {
                        this.post(files, data, progress)
                            .toDefault()
                            .then(success, error);

                        //function(complete) { scope.onProgress({percentDone: complete}); }

                        //function(ret) { scope.onDone({files: ret.files, data: ret.data}); }

                        //function(error) { scope.onError({files: scope.files, type: 'UPLOAD_ERROR', msg: error}); }
                    },

                    post: function (files, data, progressCallback) {

                        return {
                            toDefault: function () {
                                return this.to('/upload/file');
                            },
                            to: function (uploadUrl) {

                                var deferred = $q.defer()
                                if (!files || !files.length) {
                                    deferred.reject({ Message: "No files to upload" });
                                    return;
                                }

                                var xhr = new XMLHttpRequest();
                                xhr.upload.onprogress = function (e) {
                                    $rootScope.$apply(function () {
                                        var percentCompleted;
                                        if (e.lengthComputable) {
                                            percentCompleted = Math.round(e.loaded / e.total * 100);
                                            if (progressCallback) {
                                                progressCallback(percentCompleted);
                                            } else if (deferred.notify) {
                                                deferred.notify(percentCompleted);
                                            }
                                        }
                                    });
                                };

                                xhr.onload = function (e) {
                                    $rootScope.$apply(function () {
                                        var ret = {
                                            files: files,
                                            data: angular.fromJson(xhr.responseText)
                                        };
                                        deferred.resolve(ret);
                                    })
                                };

                                xhr.upload.onerror = function (e) {
                                    var msg = xhr.responseText ? xhr.responseText : "{ Message: 'An unknown error occurred posting to " + uploadUrl + "' }";
                                    $rootScope.$apply(function () {
                                        deferred.reject(angular.fromJson(msg));
                                    });
                                }

                                var formData = new FormData();

                                if (data) {
                                    Object.keys(data).forEach(function (key) {
                                        formData.append(key, data[key]);
                                    });
                                }

                                for (var idx = 0; idx < files.length; idx++) {
                                    formData.append(files[idx].name, files[idx]);
                                }

                                xhr.open("POST", uploadUrl);
                                xhr.send(formData);
                                
                                return deferred.promise;
                            }
                        };
                    }
                };
            }];

            app.lazy.factory('UploadService', Svc);
        }
    });
})();