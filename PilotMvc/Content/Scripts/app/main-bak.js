define(['App/app'], function (app) {
    //alert('Start up');
    app.init();
});

/*function memberController($scope, $http) {
    $scope.loading = true;
    $scope.addMode = false;

    $scope.titleView = 'Members View';
    $scope.titleRegister = 'New Member';

    //Used to display the data  
    $http.get('/api/Member/').success(function (data) {
        $scope.members = data;
        $scope.loading = false;
    })
    .error(function () {
        $scope.error = "An Error has occured while loading posts!";
        $scope.loading = false;
    });

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
        $http.put('/api/Member/' + memb.Id, memb).success(function (data) {
            alert("Saved Successfully!!");
            memb.editMode = false;
            $scope.loading = false;
        }).error(function (data) {
            console.log(memb, data);
            $scope.error = "An Error has occured while Saving Member! " + data;
            $scope.loading = false;

        });
    };

    //Used to add a new record  
    $scope.add = function () {
        $scope.loading = true;
        $http.post('/api/Member/', this.newmember).success(function (data) {
            alert("Added Successfully!!");
            $scope.addMode = false;
            $scope.members.push(data);
            $scope.loading = false;
        }).error(function (data) {
            $scope.error = "An Error has occured while Adding Member! " + data;
            $scope.loading = false;

        });
    };

    //Used to edit a record  
    $scope.deletemember = function () {
        $scope.loading = true;
        var memberid = this.member.Id;
        $http.delete('/api/Member/' + memberid).success(function (data) {
            alert("Deleted Successfully!!");
            $.each($scope.members, function (i) {
                if ($scope.members[i].Id === memberid) {
                    $scope.members.splice(i, 1);
                    return false;
                }
            });
            $scope.loading = false;
        }).error(function (data) {
            $scope.error = "An Error has occured while Saving Member! " + data;
            $scope.loading = false;

        });
    };
}*/