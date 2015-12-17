define(['app', 'util/string'], function (app) {
    (function (undefined) {
        app.lazy.directive('patternFormatter', ['$filter', '$locale', function ($filter, $locale) {
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

            return {
                restrict: 'A',
                require: 'ngModel',
                link: function postLink(scope, elem, attrs, modelCtrl) {
                    var pos;

                    modelCtrl.$parsers.push(function (newValue) {
                        var oldModelValue = modelCtrl.$modelValue, newModelValue, pos = getCaretPosition(elem[0]);
                        if (oldModelValue == newValue) return newValue;
                        if (!!attrs.patternFormatter && !!newValue) {
                            var strExp = attrs.patternFormatter.split('/'), flag = null, exp, beforeCursor, afterCursor;
                            if (strExp.length > 2) {
                                flag = strExp[strExp.length - 1];
                                strExp[strExp.length - 1] = '';
                            }

                            if (!!flag) {
                                exp = new RegExp(strExp.join(''), flag);
                            }
                            else {
                                exp = new RegExp(strExp.join(''));
                            }

                            beforeCursor = !!newValue.substring(0, pos).match(exp) && newValue.substring(0, pos).match(exp).length > 0 ? newValue.substring(0, pos).match(exp).join('') : '';
                            afterCursor = !!newValue.substring(pos).match(exp) && newValue.substring(pos).match(exp).length > 0 ? newValue.substring(pos).match(exp).join('') : '';
                            newModelValue = beforeCursor + afterCursor;
                            if (!newValue.match(exp)) {
                                newModelValue = oldModelValue;
                                pos = !!oldModelValue ? oldModelValue.firstDifference(newValue) : 0;
                            }
                            else {
                                pos = beforeCursor.length;
                            }
                        }
                        else {
                            newModelValue = newValue;
                        }
                        if (modelCtrl.$viewValue != newModelValue)
                            modelCtrl.$setViewValue(newModelValue);
                        elem.val(newModelValue);
                        setCaretPosition(elem[0], !pos || !newModelValue ? 0 : (pos || newModelValue.length));
                        return newModelValue;
                    });
                }
            };
        }]);
    })();
});