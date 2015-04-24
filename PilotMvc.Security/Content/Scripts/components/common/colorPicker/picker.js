(function () {
    var loaded = false;
    define(['app', 'jquery', 'angular', 'bootstrap', 'jqColorPicker'], function (app, $, angular) {
        if (!loaded) {
            app.lazy.directive("colorPicker", ['ConfigApp', '$compile', function (ConfigApp, $compile) {
                angular.element('body').after(angular.element('<link href="' + ConfigApp.getPath('/Content/Scripts/components/common/colorPicker/style.css') + '" type="text/css" rel="stylesheet" />'));

                return {
                    replace: true,
                    restrict: 'A',
                    require: "ngModel",
                    scope: {
                        colorPickerId: '@',
                        placeholder: '@',
                        className: '@',
                        colorValue:'=ngModel'
                    },
                    link: function ($scope, elem, attrs, ngModel) {
                        $(elem).addClass('myPicker');
                        var picker = $(elem).colpick({
                            layout: 'hex',
                            submit: 0,
                            colorScheme: 'dark',
                            onChange: function (hsb, hex, rgb, el, bySetColor) {
                                $(el).css('border-color', hex != 'transparent' ? '#' + hex : 'transparent');
                                // Fill the text box just if the color was set using the picker, and not the colpickSetColor function.
                                if (!bySetColor) {
                                    $scope.$apply(function () {
                                        $(el).val('#' + hex);
                                        ngModel.$setViewValue('#' + hex);
                                    });
                                }
                            }
                        }).on('keyup', function () {
                            if (!!ngModel.$modelValue && ngModel.$modelValue != '') {
                                $(elem).val(ngModel.$modelValue);
                            } else {
                                $(elem).val('transparent');
                                ngModel.$setViewValue('transparent');
                            }
                            $(this).colpickSetColor(!!ngModel.$modelValue ? ngModel.$modelValue.replace('#', '') : 'transparent');
                        }).colpickSetColor(!!$scope.colorValue ? $scope.colorValue.replace('#', '') : 'transparent');

                        $scope.$watch('colorValue', function (nval, oval) {
                            if (nval === oval) return;
                            picker.colpickSetColor(!!nval && nval != '' ? nval.replace('#', '') : 'transparent');
                        });

                        $scope.clear = function () {
                            picker.colpickSetColor(($scope.colorValue = 'transparent'));
                        };
                    }
                };
            }]);
            loaded = true;
        }
    });
})();