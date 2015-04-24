(function () {
    var Ctrl = null;
    define(['app', 'components/common/loading/loadingController', 'app/member/memberService', 'app/contact/contactService'], function (app, loadingCtrl) {
        if (Ctrl == null) {
            Ctrl = ['$scope', '$rootScope', '$filter', 'MemberService', 'ContactService', 'UploadService', function ($scope, $rootScope, $filter, memberSvc, contactSvc, uploadSvc) {
                loadingCtrl.clear(true);

                var clearContact = function () {
                    $scope.contact = { Member: { Id: 0 }, Type: { Id: 0 } };
                };

                clearContact();
                $scope.members = [];
                $scope.contactTypes = [];
                $scope.contacts = [];

                $scope.pageSize = 4;
                $scope.currentPage = 1;

                $scope.getMembers = function () {
                    loadingCtrl.startLoading();
                    memberSvc.query(
                        function (data) {
                            loadingCtrl.stopLoading();
                            console.log(data);
                            $scope.members = data;
                        },
                        function (data) {
                            console.log(data);
                            $scope.error = data.Message;
                            $scope.members = [];
                            loadingCtrl.stopLoading();
                        });
                };

                $scope.getContactTypes = function () {
                    loadingCtrl.startLoading();
                    contactSvc.getContactTypes(
                        function (data) {
                            console.log(data);
                            $scope.contactTypes = data;
                            loadingCtrl.stopLoading();
                        },
                        function (data) {
                            console.log(data);
                            $scope.error = data.Message;
                            $scope.contactTypes = [];
                            loadingCtrl.stopLoading();
                        });
                };

                $scope.getContacts = function () {
                    loadingCtrl.startLoading();
                    contactSvc.query(
                        function (data) {
                            console.log(data);
                            $scope.contacts = data;
                            loadingCtrl.stopLoading();
                        },
                        function (data) {
                            console.log(data);
                            $scope.error = data.Message;
                            $scope.contacts = [];
                            loadingCtrl.stopLoading();
                        });
                };

                $scope.create = function () {
                    loadingCtrl.startLoading();
                    this.contact.ContactTypeId = (!!this.contact.Type) ? this.contact.Type.Id : 0;
                    
                    contactSvc.create(
                        {
                            contact: $scope.contact,
                            fileName: $scope.myFile.fileData.FileName,
                            fileSize: $scope.myFile.fileData.Size
                        },
                        function (data) {
                            clearContact();
                            console.log(data);
                            $scope.contacts.push(data);
                            loadingCtrl.stopLoading();
                        },
                        function (data) {
                            console.log(data);
                            $scope.error = data.Message;
                            loadingCtrl.stopLoading();
                        });
                };

                $scope.delete = function (entity, $index) {
                    loadingCtrl.startLoading();
                    contactSvc.delete(
                        { id: entity.Id },
                        function (data) {
                            console.log(data);
                            $scope.contacts.splice($index, 1);
                            $scope.user = data;
                            loadingCtrl.stopLoading();
                        },
                        function (data) {
                            console.log(data);
                            $scope.error = data.Message;
                            loadingCtrl.stopLoading();
                        });
                };

                $scope.getContactTypes();
                $scope.getContacts();
                $scope.getMembers();
            }];

            app.lazy.controller('ContactController', Ctrl);
        };
    });
})();