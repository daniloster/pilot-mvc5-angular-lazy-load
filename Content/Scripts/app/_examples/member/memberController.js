(function () {
    var Ctrl = null;
    define(['app', 'components/common/loading/loadingController', 'app/member/memberService'], function (app, loadingCtrl) {
        if (Ctrl === null) {
            Ctrl = ['$scope', '$rootScope', '$filter', 'MemberService', function ($scope, $rootScope, $filter, memberSvc) {
                loadingCtrl.clear(true);
                $rootScope.title = "CRUD Member";
                $scope.loading = true;
                $scope.addMode = false;

                $scope.titleView = 'Members View';
                $scope.titleRegister = 'New Member';

                var searchFilter = $filter('filter');
                $scope.pager = {
                    items: function () { return searchFilter(!!$scope.members ? $scope.members : [], $scope.textFilter); },
                    currentPage: 1,
                    itemsPerPage: 4
                };

                //Used to display the data  
                $scope.getAll = function () {
                    loadingCtrl.startLoading();
                    memberSvc.query(function (data) {
                        $scope.members = data;
                        loadingCtrl.stopLoading();
                    }, function () {
                        $scope.error = "An Error has occured while loading posts!";
                        loadingCtrl.stopLoading();
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
                    loadingCtrl.startLoading();
                    var memb = this.member;
                    memberSvc.update({ Id: memb.Id }, memb, function (data) {
                        alert("Saved Successfully!!");
                        memb.editMode = false;
                        loadingCtrl.stopLoading();
                    }, function (data) {
                        console.log(memb, data);
                        $scope.error = "An Error has occured while Saving Member! " + data;
                        loadingCtrl.stopLoading();

                    });
                };

                //Used to add a new record  
                $scope.add = function () {
                    loadingCtrl.startLoading();
                    var memb = this.newmember;
                    memberSvc.create(memb, function (data) {
                        alert("Added Successfully!!");
                        $scope.addMode = false;
                        $scope.members.push(data);
                        loadingCtrl.stopLoading();
                    }, function (data) {
                        $scope.error = "An Error has occured while Adding Member! " + data;
                        loadingCtrl.stopLoading();

                    });
                };

                //Used to edit a record  
                $scope.deletemember = function () {
                    loadingCtrl.startLoading();
                    var memberid = this.member.Id;
                    memberSvc.delete({ Id: memberid }, function (data) {
                        alert("Deleted Successfully!!");
                        $.each($scope.members, function (i) {
                            if ($scope.members[i].Id === memberid) {
                                $scope.members.splice(i, 1);
                                return false;
                            }
                        });
                        loadingCtrl.stopLoading();
                    }, function (data) {
                        loadingCtrl.stopLoading();
                        $scope.error = "An Error has occured while Saving Member! " + data;

                    });
                };

                $scope.getAll();
            }];
            app.lazy.controller('MemberController', Ctrl);
        }
    });
})();