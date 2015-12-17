(function () {
    var loaded = false;
    define(['app', 'jq', 'angular', 'bootstrap', 'jqColorPicker'], function (app, $, angular) {
        if (!loaded) {
            app.lazy.directive("colorPicker", ['ConfigApp', '$compile', function (ConfigApp, $compile) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/$base.app.dest/components/common/colorPicker/style.css')));

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
                    compile: function (element, attributes) {
                        element.addClass('myPicker');
                        var input = element[0].outerHTML.replace('color-picker=""', '').replace('color-picker', ''),
                            template = "<div class='containerColorPicker'>[INPUT]<a href='javascript:;'><i class='fa fa-times'></i></a></div>".replace('[INPUT]', input);
                        
                        element.replaceWith(angular.element(template));

                        return function ($scope, elem, attrs, ngModel) {
                            var link = elem.children('a'), input = elem.children('input');
                            var picker = $(input).colpick({
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
                                    $(input).val(ngModel.$modelValue);
                                } else {
                                    $(input).val('transparent');
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

                            link.on('click', $scope.clear);
                        };
                    }
                };
            }]);
            loaded = true;
        }
    });
})();