(function () {
    var Ctrl = null;
    define(['angular', 'app', 'auth/session'], function (angular, app, session) {
        if (Ctrl == null) {
            Ctrl = ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
                var isMoveNextValid = true;
                $scope.items = session.workflow.items().filter(function (item, idx) {
                    return idx > 0;
                });
                $scope.currentStep = session.workflow.getCurrentStep();
                $scope.lastStep = $scope.items.length ? $scope.items[$scope.items.length - 1] : undefined;
                $scope.secondLastStep = $scope.items.length > 1 ? $scope.items[$scope.items.length - 2] : undefined;

                $scope.hideAll = !!$scope.lastStep && $scope.lastStep.name == $scope.currentStep.name;

                $scope.isLastMove = !!$scope.secondLastStep && $scope.secondLastStep.name == $scope.currentStep.name;

                $scope.movePrevious = function () {
                    session.workflow.movePrevious($location);
                };

                $scope.$on('Workflow:set_IsMoveNextValid', function (evt, isValid) {
                    isMoveNextValid = isMoveNextValid && isValid;
                });

                $scope.moveNext = function () {
                    isMoveNextValid = true;
                    $rootScope.$broadcast('Workflow:get_IsMoveNextValid');
                    if (isMoveNextValid) {
                        if (angular.isFunction(session.workflow.onMoveNext)) {
                            session.workflow.onMoveNext(function () { session.workflow.moveNext($location); });
                        } else {
                            session.workflow.moveNext($location);
                        }
                    }
                };

            }];
            app.lazy.controller('WorkflowFooterController', Ctrl);
        }
    });
})();