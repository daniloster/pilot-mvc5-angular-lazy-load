(function () {
    var Ctrl = null;
    define(['app', 'app/member/memberSvc', 'app/contact/contactSvc', 'app/upload/uploadSvc', 'app/upload/fileModel'], function (app) {
        if (Ctrl == null) {
            Ctrl = ['$scope', 'memberSvc', 'contactSvc', 'uploadSvc', function ($scope, memberSvc, contactSvc, uploadSvc) {
                var clearContact = function () {
                    $scope.contact = { Member: { Id: 0 }, Type: { Id: 0 } };
                    $scope.myFileData = {};
                    $scope.fileHasBeenSelected = false;
                    $scope.fileHasBeenUploaded = false;
                };

                clearContact();
                $scope.members = [];
                $scope.contactTypes = [];
                $scope.contacts = [];

                $scope.$watch('myFile', function (nval, oval) {
                    if (nval === oval) return;
                    $scope.fileHasBeenSelected = !!nval;
                    $scope.fileHasBeenUploaded = false;
                });
                //var find = Array.createFinder('Id');
                //$scope.contact.Member = find($scope.members, $scope.contact.Member.Id);

                $scope.getMembers = function () {
                    //loadingCtrl.startLoad();
                    memberSvc.query(
                        function (data) {
                            //loadingCtrl.stopLoad();
                            console.log(data);
                            $scope.members = data;
                        },
                        function (data) {
                            //loadingCtrl.stopLoad();
                            console.log(data);
                            $scope.members = [];
                        });
                };

                $scope.getContactTypes = function () {
                    //loadingCtrl.startLoad();
                    contactSvc.getContactTypes(
                        function (data) {
                            //loadingCtrl.stopLoad();
                            console.log(data);
                            $scope.contactTypes = data;
                        },
                        function (data) {
                            //loadingCtrl.stopLoad();
                            console.log(data);
                            $scope.contactTypes = [];
                        });
                };

                $scope.getContacts = function () {
                    //loadingCtrl.startLoad();
                    contactSvc.query(
                        function (data) {
                            //loadingCtrl.stopLoad();
                            console.log(data);
                            $scope.contacts = data;
                        },
                        function (data) {
                            //loadingCtrl.stopLoad();
                            console.log(data);
                            $scope.contacts = [];
                        });
                };

                $scope.upload = function () {
                    uploadSvc.sendFile($scope.myFile,
                        function (data) {
                            $scope.myFileData = data;
                            $scope.fileHasBeenUploaded = true;
                        },
                        function (data) {
                            $scope.myFileData = {};
                            $scope.fileHasBeenUploaded = false;
                        });
                };

                $scope.create = function () {
                    //loadingCtrl.startLoad();
                    this.contact.ContactTypeId = (!!this.contact.Type) ? this.contact.Type.Id : 0;
                    
                    contactSvc.create(
                        {
                            contact: $scope.contact,
                            fileName: $scope.myFileData.FileName,
                            fileSize: $scope.myFileData.Size
                        },
                        function (data) {
                            //loadingCtrl.stopLoad();
                            clearContact();
                            console.log(data);
                            $scope.contacts.push(data);
                        },
                        function (data) {
                            //loadingCtrl.stopLoad();
                            console.log(data);
                        });
                };

                $scope.delete = function (entity, $index) {
                    //loadingCtrl.startLoad();
                    contactSvc.delete(
                        { id: entity.Id },
                        function (data) {
                            //loadingCtrl.stopLoad();
                            console.log(data);
                            $scope.contacts.splice($index, 1);
                            $scope.user = data;
                        },
                        function (data) {
                            //loadingCtrl.stopLoad();
                            console.log(data);
                        });
                };

                $scope.getContactTypes();
                $scope.getContacts();
                $scope.getMembers();
            }];

            app.lazy.controller('contactCtrl', Ctrl);
        };
    });
})();