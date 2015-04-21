define(['app'], function (app, $) {
    (function (undefined) {
        // TODO: Move to polyfill?
        if (!String.prototype.trim) {
            String.prototype.trim = function () {
                return this.replace(/^\s+|\s+$/g, '');
            };
        }

        app.lazy.directive('currencyFormatter', ['$filter', '$locale', function ($filter, $locale) {
            var decimalSep = $locale.NUMBER_FORMATS.DECIMAL_SEP;
            var toNumberRegex = new RegExp('[^0-9\\' + decimalSep + ']', 'g');
            var removeNonNumberRegex = new RegExp('[^0-9\\' + decimalSep + ']', 'g');
            var filterFunc = function (value, symbol) {
                return $filter('currency')(value, symbol);
            };

            function getCaretPosition(input) {
                if (!input) return 0;
                if (input.selectionStart !== undefined) {
                    return input.selectionStart;
                } else if (document.selection) {
                    // Curse you IE
                    input.focus();
                    var selection = document.selection.createRange();
                    selection.moveStart('character', input.value ? -input.value.length : 0);
                    return selection.text.length;
                }
                return 0;
            }

            function setCaretPosition(input, pos) {
                if (!input) return 0;
                if (input.offsetWidth === 0 || input.offsetHeight === 0) {
                    return; // Input's hidden
                }
                if (input.setSelectionRange) {
                    input.focus();
                    input.setSelectionRange(pos, pos);
                }
                else if (input.createTextRange) {
                    // Curse you IE
                    var range = input.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', pos);
                    range.moveStart('character', pos);
                    range.select();
                }
            }

            function toNumber(currencyStr) {
                return parseFloat(currencyStr.replace(' ', '').replace(toNumberRegex, ''), 10);
            }

            return {
                restrict: 'A',
                require: 'ngModel',
                link: function postLink(scope, elem, attrs, modelCtrl) {
                    var currencySymbol = (!!attrs.currencySymbol ? attrs.currencySymbol : '€')
                    modelCtrl.$formatters.push(function (value) { filterFunc(value, currencySymbol); });
                    modelCtrl.$parsers.push(function (newViewValue) {
                        var oldModelValue = modelCtrl.$modelValue;
                        
                        var partVal = '00' + newViewValue
                            .replace(currencySymbol, '')
                            .replace(new RegExp('[,]', 'g'), '')
                            .replace(new RegExp('[.]', 'g'), '');

                        if (isNaN(partVal)) {
                            modelCtrl.$viewValue = filterFunc(oldModelValue, currencySymbol);
                            elem.val(modelCtrl.$viewValue);
                            setCaretPosition(elem[0], modelCtrl.$viewValue.length);
                            return oldModelValue;
                        }

                        newViewValue = [partVal.substr(0, partVal.length - 2), partVal.substr(partVal.length - 2)].join('.')

                        var newModelValue = toNumber(newViewValue);

                        modelCtrl.$viewValue = filterFunc(newModelValue, currencySymbol);
                        newModelValue = toNumber(newViewValue);
                        var pos = getCaretPosition(elem[0]);
                        elem.val(modelCtrl.$viewValue);
                        setCaretPosition(elem[0], modelCtrl.$viewValue.length);
                        return newModelValue;
                    });
                }
            };
        }]);
    })();
});