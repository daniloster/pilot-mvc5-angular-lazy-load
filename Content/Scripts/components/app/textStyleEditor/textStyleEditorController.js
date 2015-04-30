(function () {
    var Ctrl = null;
    define(['app'], function (app) {
        if (Ctrl == null) {
            Ctrl = ['$scope', '$rootScope', function ($scope, $rootScope) {
                var backupElement = {}, evtConfirm = null;

                $scope.font = {
                    sizes: [{ Name: "7px" }, { Name: "8px" }, { Name: "9px" }, { Name: "10px" }, { Name: "11px" }, { Name: "12px" }, { Name: "13px" }, { Name: "14px" }, { Name: "16px" }, { Name: "18px" }, { Name: "20px" }, { Name: "22px" }],
                    families: [
                        { Name: "Domine", Value: "Domine", Weights: [{ Name: "Normal", Value: "normal" }, { Name: "Bold", Value: "bold" }] },
                        { Name: "Lato", Value: "Lato", Weights: [{ Name: "Light", Value: "light" }, { Name: "Normal", Value: "normal" }, { Name: "Bold", Value: "bold" }, { Name: "Bolder", Value: "bolder" }] },
                        { Name: "Open Sans", Value: "Open Sans", Weights: [{ Name: "Light", Value: "light" }, { Name: "Normal", Value: "normal" }, { Name: "Bold", Value: "bold" }, { Name: "Bolder", Value: "bolder" }] },
                        { Name: "Montserrat", Value: "Montserrat", Weights: [{ Name: "Normal", Value: "normal" }, { Name: "Bold", Value: "bold" }] },
                        { Name: "Arvo", Value: "Arvo", Weights: [{ Name: "Normal", Value: "normal" }, { Name: "Bold", Value: "bold" }] },
                        { Name: "Old Standard TT", Value: "Old Standard T", Weights: [{ Name: "Normal", Value: "normal" }, { Name: "Bold", Value: "bold" }] },
                        { Name: "PT Sans", Value: "PT Sans", Weights: [{ Name: "Normal", Value: "normal" }, { Name: "Bold", Value: "bold" }] },
                        { Name: "PT Serif", Value: "PT Serif", Weights: [{ Name: "Normal", Value: "normal" }, { Name: "Bold", Value: "bold" }] },
                        { Name: "Oswald", Value: "Oswald", Weights: [{ Name: "Light", Value: "light" }, { Name: "Normal", Value: "normal" }, { Name: "Bold", Value: "bold" }] },
                        { Name: "Nunito", Value: "Nunito", Weights: [{ Name: "Light", Value: "light" }, { Name: "Normal", Value: "normal" }, { Name: "Bold", Value: "bold" }] }
                    ]
                };

                $scope.confirmEditing = function () {
                    $scope.onConfirmEditing();
                    var finalElement = $scope.element;
                    if (evtConfirm != null) {
                        $rootScope.$broadcast(evtConfirm, finalElement);
                    }
                    $scope.element = null;
                };

                $scope.cancelEditing = function () {
                    $scope.onCancelEditing();
                    $scope.element = null;
                };

                $scope.$on($scope.editorId + ':init', function (evt, args) {
                    evtConfirm = args.callback;
                    backupElement = JSON.stringify(args.value);
                    var editing = JSON.parse(backupElement);
                    editing.FontFamily = (Array.createFinder('Name'))($scope.font.families, editing.FontFamily);
                    editing.FontWeight = (Array.createFinder('Name'))(!!editing.FontFamily ? editing.FontFamily.Weights : [], editing.FontWeight);
                    editing.FontSize = (Array.createFinder('Name'))($scope.font.sizes, editing.FontSize);
                    $scope.element = editing;
                });
            }];

            app.lazy.controller('TextStyleEditorController', Ctrl);
        };
    });
})();