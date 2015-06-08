(function () {
    var Element = null;
    define(['app', 'components/common/loading/loadingController', 'components/common/fileUpload/uploadService'], function (app, loadingController) {
        if (Element === null) {            
            Element = ['$parse', 'ConfigApp', function ($parse, configApp) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/fileUpload/file-style.css')));

                return {
                    scope:{
                        file: '=',
                        pathKey: '@',
                        fireOnchange: '@',
                        showProgress: '@'
                    },
                    restrict: 'EA',
                    templateUrl: configApp.getPath('/Content/Scripts/components/common/fileUpload/file-template.html'),
                    controller: ['$scope', 'UploadService', function ($scope, uploadService) {
                        $scope.clear = function () {
                            $scope.fileProgress = undefined;
                            $scope.styleProgress = {};
                        };

                        $scope.$watch('file', function (nval, oval) {
                            if (nval === oval) return;
                            if (!!$scope.file) {
                                $scope.file.hasBeenUploaded = false;
                                $scope.clear();
                            }
                        });

                        $scope.upload = function (file) {
                            $scope.clear();
                            if (!$scope.showProgress) {
                                loadingController.startLoading();
                            }
                            uploadService.upload(file, { type: 'file', folderType: !!$scope.pathKey ? $scope.pathKey : 'ProfilePath' },
                            function (progress) {
                                $scope.fileProgress = progress;
                                $scope.styleProgress = { 'width': progress + '%' };
                            },
                            function (data) {
                                file.fileData = data.data;
                                file.hasBeenUploaded = true;
                                if (!$scope.showProgress) {
                                    loadingController.stopLoading();
                                }
                            },
                            function (data) {
                                file.fileData = {};
                                file.hasBeenUploaded = false;
                                if (!$scope.showProgress) {
                                    loadingController.stopLoading();
                                }
                            });
                        };

                    }],
                    link: function (scope, element, attrs) {
                        scope.fireOnchange = (scope.fireOnchange != undefined && (scope.fireOnchange == true || scope.fireOnchange.toUpperCase() == 'TRUE'));
                        scope.showProgress = (scope.showProgress != undefined && (scope.showProgress == true || scope.showProgress.toUpperCase() == 'TRUE'));

                        var elem = element.find('[type=file]');
                        elem.bind('change', function () {
                            scope.$apply(function () {
                                scope.file = elem[0].files;
                                if (!!scope.file && scope.fireOnchange) {
                                    scope.upload(scope.file);
                                }
                            });
                        });

                        scope.clearFileReferences = function () {
                            scope.clear();
                            scope.file = undefined;
                            elem[0].value = '';
                        };
                    }
                };
            }];

            app.lazy.directive('fileUpload', Element);
        }
    });
})();