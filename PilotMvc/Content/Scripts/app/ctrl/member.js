(function () {
    var MemberCtrl = null;
    define(['app', 'app/svc/member'], function (app) {
        if (MemberCtrl === null) {
            MemberCtrl = ['$scope', 'MemberSvc', function ($scope, MemberSvc) {
                $scope.loading = true;
                $scope.addMode = false;

                $scope.titleView = 'Members View';
                $scope.titleRegister = 'New Member';

                //Used to display the data  
                $scope.getAll = function () {
                    MemberSvc.query(function (data) {
                        $scope.members = data;
                        $scope.loading = false;
                    }, function () {
                        $scope.error = "An Error has occured while loading posts!";
                        $scope.loading = false;
                    });
                };

                $scope.toggleEdit = function () {
                    this.member.editMode = !this.member.editMode;
                };
                $scope.toggleAdd = function () {
                    this.newmember = {};
                    $scope.addMode = !$scope.addMode;
                };

                //Used to save a record after edit  
                $scope.save = function () {
                    $scope.loading = true;
                    var memb = this.member;
                    MemberSvc.update({ Id: memb.Id }, memb, function (data) {
                        alert("Saved Successfully!!");
                        memb.editMode = false;
                        $scope.loading = false;
                    }, function (data) {
                        console.log(memb, data);
                        $scope.error = "An Error has occured while Saving Member! " + data;
                        $scope.loading = false;

                    });
                };

                //Used to add a new record  
                $scope.add = function () {
                    $scope.loading = true;
                    var memb = this.newmember;
                    MemberSvc.create(memb, function (data) {
                        alert("Added Successfully!!");
                        $scope.addMode = false;
                        $scope.members.push(data);
                        $scope.loading = false;
                    }, function (data) {
                        $scope.error = "An Error has occured while Adding Member! " + data;
                        $scope.loading = false;

                    });
                };

                //Used to edit a record  
                $scope.deletemember = function () {
                    $scope.loading = true;
                    var memberid = this.member.Id;
                    MemberSvc.delete({ Id: memberid }, function (data) {
                        alert("Deleted Successfully!!");
                        //$.each($scope.members, function (i) {
                        //    if ($scope.members[i].Id === memberid) {
                        //        $scope.members.splice(i, 1);
                        //        return false;
                        //    }
                        //});
                        $scope.getAll();
                        //$scope.loading = false;
                    }, function (data) {
                        $scope.error = "An Error has occured while Saving Member! " + data;
                        $scope.loading = false;

                    });
                };

                $scope.getAll();
            }];
            MemberCtrl.name = 'MemberCtrl';
            app.lazy.controller(MemberCtrl.name, MemberCtrl);
        }
    });
})();