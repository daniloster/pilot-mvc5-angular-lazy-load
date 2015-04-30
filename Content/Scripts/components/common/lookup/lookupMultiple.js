(function () {
    var loaded = false;
    define(['app', 'jquery', 'angular', 'bootstrap', 'components/common/lookup/lookupMultipleController'], function (app, $, angular) {
        if (!loaded) {

            app.lazy.directive("lookupMultiple", ['ConfigApp', '$compile', '$parse', function (ConfigApp, $compile, $parse) {
                angular.element('body').after(angular.element('<link href="' + ConfigApp.getPath('/Content/Scripts/components/common/lookup/style.css') + '" type="text/css" rel="stylesheet" />'));

                var templateDropdown = '<select id="dropdown[LOOKUP:ID]" name="dropdown[LOOKUP:ID]" [LOOKUP:REQUIRED] multiple class="ng-hide">' +
                    '   <option value="{{ item[comparatorProperty] }}" selected ng-repeat="item in selecteds">{{ (!!labelProperty ? item[labelProperty] : item.toString()) }}</option>' +
                    '</select>',
                templateListAvailable = '<div id="listAvailable[LOOKUP:ID]" name="listAvailable[LOOKUP:ID]" ng-show="activeLookup()" class="chosen-drop anim-slide"><ul class="chosen-results">' +
                    '   <li class="group-option" ng-click="select(item)" ng-class="{ \'active-result\': isAvailable(item), \'result-selected\': isSelected(item) }" ng-repeat="item in dataSource">{{ (!!labelProperty ? item[labelProperty] : item.toString()) }}</li>' +
                    '</ul></div>';
                templateListSelected = '<div id="listSelected[LOOKUP:ID]" name="listSelected[LOOKUP:ID]" class="chosen-drop anim-slide"><ul class="chosen-results">' +
                    '   <li class="group-option" class="item-selected" ng-repeat="item in selecteds">{{ (!!labelProperty ? item[labelProperty] : item.toString()) }}<a href="javascript:;" ng-click="remove(item)"><i class="fa fa-times"></i></a></li>' +
                    '</ul></div>';
                return {
                    restrict: 'A',
                    scope: {
                        required: '@',
                        triggerFrom: '@',
                        idProperty: '@',
                        labelProperty: '@?',
                        sourceRef: '@?',
                        sourceArgs: '=',
                        selecteds: '='
                    },
                    controller: 'LookupMultipleController',
                    compile: function (elem, attrs) {
                        attrs.id = attrs.id == undefined ? "elem-" + new Date().getTime() : attrs.id;
                        var customTemplateDropdown = templateDropdown.replaceAll('[LOOKUP:ID]', attrs.id)
                            .replaceAll('[LOOKUP:REQUIRED]', 'required', attrs.required == "" || attrs.required == "true"),
                        customTemplateListAvailable = templateListAvailable.replaceAll('[LOOKUP:ID]', attrs.id)
                            .replaceAll('[LOOKUP:REQUIRED]', 'required', attrs.required == "" || attrs.required == "true"),
                        customTemplateListSelected = templateListSelected.replaceAll('[LOOKUP:ID]', attrs.id)
                            .replaceAll('[LOOKUP:REQUIRED]', 'required', attrs.required == "" || attrs.required == "true");

                        return function ($scope, iElem, iAttrs) {
                            var dropdown = angular.element(customTemplateDropdown),
                                listAvailable = angular.element(customTemplateListAvailable),
                                listSelected = angular.element(customTemplateListSelected);
                                
                            iElem.after(dropdown);
                            iElem.after(listAvailable);
                            iElem.after(listSelected);
                            $compile(dropdown)($scope);
                            $compile(listAvailable)($scope);
                            $compile(listSelected)($scope);

                            $scope.activeLookup = function () {
                                return !!$scope.dataSource && $scope.dataSource.length;
                            };


                            $(iElem).on('keyup', function () {
                                var query = $(iElem).val();
                                if (query.length >= parseInt($scope.triggerFrom)) {
                                    $scope.lookup(query);
                                } else {
                                    $scope.dataSource = [];
                                }
                            });
                        };
                    }
                };
            }]);

            loaded = true;
        }
    });
})();



//if (element.next().length) {
//    element.next().insertBefore(element);
//}

//var contentTr = angular.element('<tr><td>test</td></tr>');
//contentTr.insertAfter(element);
//$compile(contentTr)(scope);