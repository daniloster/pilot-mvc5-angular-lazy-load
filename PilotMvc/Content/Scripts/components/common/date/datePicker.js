(function () {
    /*
    <input type="text" date-time ng-model="justDate" views="['date']" format="dd/MM/yyyy" class="just-date" partial="true" readonly required/>
    */
    var loaded = false;
    define(['app'], function (app) {
        if (!loaded) {
            //var Module = angular.module('datePicker', []);

            app.lazy.constant('datePickerConfig', {
                template: '/Content/Scripts/components/common/date/picker.html',
                view: 'date',
                views: ['year', 'month', 'date', 'hours', 'minutes'],
                step: 5
            });

            app.lazy.filter('time', function () {
                function format(date) {
                    return ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
                }

                return function (date) {
                    if (!(date instanceof Date)) {
                        date = new Date(date);
                        if (isNaN(date.getTime())) {
                            return undefined;
                        }
                    }
                    return format(date);
                };
            });

            app.lazy.factory('datePickerUtils', function () {
                return {
                    getVisibleMinutes: function (date, step) {
                        date = new Date(date || new Date());
                        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
                        var minutes = [];
                        var stop = date.getTime() + 60 * 60 * 1000;
                        while (date.getTime() < stop) {
                            minutes.push(date);
                            date = new Date(date.getTime() + step * 60 * 1000);
                        }
                        return minutes;
                    },
                    getVisibleWeeks: function (date) {
                        date = new Date(date || new Date());
                        var startMonth = date.getMonth(), startYear = date.getYear();
                        date.setDate(1);
                        date.setHours(0);
                        date.setMinutes(0);
                        date.setSeconds(0);
                        date.setMilliseconds(0);

                        if (date.getDay() === 0) {
                            date.setDate(-5);
                        } else {
                            date.setDate(date.getDate() - (date.getDay() - 1));
                        }
                        if (date.getDate() === 1) {
                            date.setDate(-6);
                        }

                        var weeks = [];
                        while (weeks.length < 6) {
                            /*jshint -W116 */
                            if (date.getYear() === startYear && date.getMonth() > startMonth) break;
                            var week = [];
                            for (var i = 0; i < 7; i++) {
                                week.push(new Date(date));
                                date.setDate(date.getDate() + 1);
                            }
                            weeks.push(week);
                        }
                        return weeks;
                    },
                    getVisibleYears: function (date) {
                        var years = [];
                        date = new Date(date || new Date());
                        date.setFullYear(date.getFullYear() - (date.getFullYear() % 10));
                        for (var i = 0; i < 12; i++) {
                            years.push(new Date(date.getFullYear() + (i - 1), 0, 1));
                        }
                        return years;
                    },
                    getDaysOfWeek: function (date) {
                        date = new Date(date || new Date());
                        date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                        date.setDate(date.getDate() - (date.getDay() - 1));
                        var days = [];
                        for (var i = 0; i < 7; i++) {
                            days.push(new Date(date));
                            date.setDate(date.getDate() + 1);
                        }
                        return days;
                    },
                    getVisibleMonths: function (date) {
                        date = new Date(date || new Date());
                        var year = date.getFullYear();
                        var months = [];
                        for (var month = 0; month < 12; month++) {
                            months.push(new Date(year, month, 1));
                        }
                        return months;
                    },
                    getVisibleHours: function (date) {
                        date = new Date(date || new Date());
                        date.setHours(0);
                        date.setMinutes(0);
                        date.setSeconds(0);
                        date.setMilliseconds(0);
                        var hours = [];
                        for (var i = 0; i < 24; i++) {
                            hours.push(date);
                            date = new Date(date.getTime() + 60 * 60 * 1000);
                        }
                        return hours;
                    },
                    isAfter: function (model, date) {
                        return model && model.getTime() <= date.getTime();
                    },
                    isBefore: function (model, date) {
                        return model.getTime() >= date.getTime();
                    },
                    isSameYear: function (model, date) {
                        return model && model.getFullYear() === date.getFullYear();
                    },
                    isSameMonth: function (model, date) {
                        return this.isSameYear(model, date) && model.getMonth() === date.getMonth();
                    },
                    isSameDay: function (model, date) {
                        return this.isSameMonth(model, date) && model.getDate() === date.getDate();
                    },
                    isSameHour: function (model, date) {
                        return this.isSameDay(model, date) && model.getHours() === date.getHours();
                    },
                    isSameMinutes: function (model, date) {
                        return this.isSameHour(model, date) && model.getMinutes() === date.getMinutes();
                    }
                };
            });

            app.lazy.directive('datePicker', ['datePickerConfig', 'datePickerUtils', '$parse', 'ConfigApp', function datePickerDirective(datePickerConfig, datePickerUtils, $parse, ConfigApp) {

                //noinspection JSUnusedLocalSymbols
                return {
                    // this is a bug ?
                    template: '<div ng-include="template"></div>',
                    scope: {
                        model: '=datePicker',
                        after: '=?',
                        before: '=?',
                        unavailableAfter: '=?',
                        unavailableBefore: '=?'
                    },
                    link: function (scope, element, attrs, ne) {

                        scope.date = new Date(scope.model || new Date());
                        scope.views = datePickerConfig.views.concat();
                        scope.view = attrs.view || datePickerConfig.view;
                        scope.now = new Date();
                        scope.template = attrs.template || ConfigApp.getPath(datePickerConfig.template);
                        if (scope.unavailableBefore) {
                            scope.minAvailableDate = new Date(scope.unavailableBefore);
                            scope.minAvailableDate.setDate(scope.minAvailableDate.getDate() + 1);
                        }
                        if (scope.unavailableAfter) {
                            scope.maxAvailableDate = new Date(scope.unavailableAfter);
                            scope.maxAvailableDate.setDate(scope.maxAvailableDate.getDate() - 1);
                        }

                        var applyValue = function (value) {
                            scope.model = value;
                        };

                        var step = parseInt(attrs.step || datePickerConfig.step, 10);
                        var partial = attrs.partial != "false";

                        /** @namespace attrs.minView, attrs.maxView */
                        scope.views = scope.views.slice(
                          scope.views.indexOf('year'),
                          scope.views.indexOf('minutes') + 1
                        );

                        if (scope.views.length === 1 || scope.views.indexOf(scope.view) === -1) {
                            scope.view = scope.views[0];
                        }

                        scope.setView = function (nextView) {
                            if (scope.views.indexOf(nextView) !== -1) {
                                scope.view = nextView;
                            }
                        };

                        scope.setDate = function (date) {
                            var maxAvailableDate = new Date(scope.unavailableAfter);
                            maxAvailableDate.setDate(maxAvailableDate.getDate() - 1);
                            if (!!scope.unavailableBefore && date.getFullYear() == maxAvailableDate.getFullYear()) {
                                if (scope.view == 'year') {
                                    date = maxAvailableDate;
                                }
                                else if (scope.view == 'month' && date.getMonth() == maxAvailableDate.getMonth()) {
                                    date = maxAvailableDate;
                                }
                            }
                            var minAvailableDate = new Date(scope.unavailableBefore);
                            minAvailableDate.setDate(minAvailableDate.getDate() + 1);
                            if (!!scope.unavailableBefore && date.getFullYear() == minAvailableDate.getFullYear()) {
                                if (scope.view == 'year') {
                                    date = minAvailableDate;
                                }
                                else if (scope.view == 'month' && date.getMonth() == minAvailableDate.getMonth()) {
                                    date = minAvailableDate;
                                }
                            }
                            if (attrs.disabled || (scope.isUnavailableAfter(date)) || (scope.isUnavailableBefore(date))) {
                                return;
                            }
                            scope.date = date;
                            // change next view
                            var nextView = scope.views[scope.views.indexOf(scope.view) + 1];
                            if ((!nextView || partial) || scope.model) {

                                //scope.model = new Date(scope.model || date);
                                var view = partial ? 'minutes' : scope.view;
                                //noinspection FallThroughInSwitchStatementJS
                                //switch (view) {
                                //    case 'minutes':
                                //        scope.model.setMinutes(date.getMinutes());
                                //        /*falls through*/
                                //    case 'hours':
                                //        scope.model.setHours(date.getHours());
                                //        /*falls through*/
                                //    case 'date':
                                //        scope.model.setDate(date.getDate());
                                //        /*falls through*/
                                //    case 'month':
                                //        scope.model.setMonth(date.getMonth());
                                //        /*falls through*/
                                //    case 'year':
                                //        scope.model.setFullYear(date.getFullYear());
                                //}
                                if (scope.view == attrs.minView) {
                                    applyValue(date);
                                    scope.$emit('setDate', scope.model, scope.view);
                                }
                            }

                            if (nextView) {
                                scope.setView(nextView);
                            }
                        };

                        function update() {
                            var view = scope.view;
                            var date = scope.date;
                            switch (view) {
                                case 'year':
                                    scope.years = datePickerUtils.getVisibleYears(date);
                                    break;
                                case 'month':
                                    scope.months = datePickerUtils.getVisibleMonths(date);
                                    break;
                                case 'date':
                                    scope.weekdays = scope.weekdays || datePickerUtils.getDaysOfWeek();
                                    scope.weeks = datePickerUtils.getVisibleWeeks(date);
                                    break;
                                case 'hours':
                                    scope.hours = datePickerUtils.getVisibleHours(date);
                                    break;
                                case 'minutes':
                                    scope.minutes = datePickerUtils.getVisibleMinutes(date, step);
                                    break;
                            }
                        }

                        function watch() {
                            if (scope.view !== 'date') {
                                return scope.view;
                            }
                            return scope.model ? scope.model.getMonth() : null;
                        }


                        scope.$watch(watch, update);

                        scope.next = function (delta) {
                            var date = scope.date;
                            delta = delta || 1;
                            switch (scope.view) {
                                case 'year':
                                    /*falls through*/
                                case 'month':
                                    date.setFullYear(date.getFullYear() + delta);
                                    break;
                                case 'date':
                                    date.setMonth(date.getMonth() + delta);
                                    break;
                                case 'hours':
                                    /*falls through*/
                                case 'minutes':
                                    date.setHours(date.getHours() + delta);
                                    break;
                            }
                            update();
                        };

                        scope.prev = function (delta) {
                            return scope.next(-delta || -1);
                        };

                        scope.isAfter = function (date) {
                            return scope.after && datePickerUtils.isAfter(date, scope.after);
                        };

                        scope.isBefore = function (date) {
                            return scope.before && datePickerUtils.isBefore(date, scope.before);
                        };

                        scope.isUnavailableAfter = function (date) {
                            return scope.unavailableAfter && datePickerUtils.isBefore(date, new Date(scope.unavailableAfter));
                        };

                        scope.isUnavailableBefore = function (date) {
                            return scope.unavailableBefore && datePickerUtils.isAfter(date, new Date(scope.unavailableBefore));
                        };

                        scope.isSameMonth = function (date) {
                            return datePickerUtils.isSameMonth(scope.model, date);
                        };

                        scope.isSameYear = function (date) {
                            return datePickerUtils.isSameYear(scope.model, date);
                        };

                        scope.isSameDay = function (date) {
                            return datePickerUtils.isSameDay(scope.model, date);
                        };

                        scope.isSameHour = function (date) {
                            return datePickerUtils.isSameHour(scope.model, date);
                        };

                        scope.isSameMinutes = function (date) {
                            return datePickerUtils.isSameMinutes(scope.model, date);
                        };

                        scope.isNow = function (date) {
                            var is = true;
                            var now = scope.now;
                            //noinspection FallThroughInSwitchStatementJS
                            switch (scope.view) {
                                case 'minutes':
                                    is &= ~~(date.getMinutes() / step) === ~~(now.getMinutes() / step);
                                    /*falls through*/
                                case 'hours':
                                    is &= date.getHours() === now.getHours();
                                    /*falls through*/
                                case 'date':
                                    is &= date.getDate() === now.getDate();
                                    /*falls through*/
                                case 'month':
                                    is &= date.getMonth() === now.getMonth();
                                    /*falls through*/
                                case 'year':
                                    is &= date.getFullYear() === now.getFullYear();
                            }
                            return is;
                        };
                    }
                };
            }]);

            app.lazy.directive('dateRange', ['ConfigApp', function (ConfigApp) {
                return {
                    templateUrl: ConfigApp.getPath('/Content/Scripts/components/common/date/range.html'),
                    scope: {
                        start: '=',
                        end: '='
                    },
                    link: function (scope, element, attrs) {
                        attrs.$observe('disabled', function (isDisabled) {
                            scope.disableDatePickers = !!isDisabled;
                        });
                        scope.$watch('start.getTime()', function (value) {
                            if (value && scope.end && value > scope.end.getTime()) {
                                scope.end = new Date(value);
                            }
                        });
                        scope.$watch('end.getTime()', function (value) {
                            if (value && scope.start && value < scope.start.getTime()) {
                                scope.start = new Date(value);
                            }
                        });
                    }
                };
            }]);

            var PRISTINE_CLASS = 'ng-pristine',
                DIRTY_CLASS = 'ng-dirty';

            app.lazy.constant('dateTimeConfig', {
                template: function (attrs) {
                    return '' +
                        '<div ' +
                        'date-picker="' + attrs.ngModel + '" ' +
                        (attrs.view ? 'view="' + attrs.view + '" ' : '') +
                        (attrs.maxView ? 'max-view="' + attrs.maxView + '" ' : '') +
                        (attrs.template ? 'template="' + attrs.template + '" ' : '') +
                        (attrs.minView ? 'min-view="' + attrs.minView + '" ' : '') +
                        (attrs.partial ? 'partial="' + attrs.partial + '" ' : '') +
                        (attrs.unavailableAfter ? 'unavailable-after="' + attrs.unavailableAfter + '" ' : '') +
                        (attrs.unavailableBefore ? 'unavailable-before="' + attrs.unavailableBefore + '" ' : '') +
                        'class="dropdown-menu"></div>';
                },
                format: 'yyyy-MM-dd HH:mm',
                views: ['date', 'year', 'month', 'hours', 'minutes'],
                dismiss: true,
                position: 'absolute'
            });

            app.lazy.directive('dateTimeAppend', function () {
                return {
                    link: function (scope, element) {
                        element.bind('mouseup', function () {
                            element.find('input')[0].focus();
                        });
                    }
                };
            });

            app.lazy.directive('dateTime', ['$compile', '$document', '$filter', '$parse', '$timeout', 'dateTimeConfig', 'ConfigApp', function ($compile, $document, $filter, $parse, $timeout, dateTimeConfig, ConfigApp) {
                var body = $document.find('body');
                var dateFilter = $filter('date');
                angular.element('body').after(angular.element('<link href="' + ConfigApp.getPath('/Content/Scripts/components/common/date/style.css') + '" type="text/css" rel="stylesheet" />'));

                return {
                    require: 'ngModel',
                    scope: true,
                    link: function (scope, element, attrs, ngModel) {
                        var keepDisplaying = !!attrs.keepDisplaying && attrs.keepDisplaying != "false" && attrs.keepDisplaying != false;
                        var format = attrs.format || dateTimeConfig.format;
                        var parentForm = element.inheritedData('$formController');
                        var views = $parse(attrs.views)(scope) || dateTimeConfig.views.concat();
                        var view = attrs.view || views[0];
                        var index = views.indexOf(view);
                        var dismiss = attrs.dismiss ? $parse(attrs.dismiss)(scope) : dateTimeConfig.dismiss;
                        var picker = null;
                        var position = attrs.position || dateTimeConfig.position;
                        var container = null;

                        attrs.view = view;

                        if (index === -1) {
                            views.splice(index, 1);
                        }

                        views.unshift(view);

                        attrs.minView = views[views.length - 1];
                        attrs.maxView = views[0];

                        function formatter(value) {
                            return dateFilter(value, format);
                        }

                        function parser() {
                            return ngModel.$modelValue;
                        }

                        ngModel.$formatters.push(formatter);
                        ngModel.$parsers.unshift(parser);


                        var template = dateTimeConfig.template(attrs);

                        function updateInput(event) {
                            event.stopPropagation();
                            if (ngModel.$pristine) {
                                ngModel.$dirty = true;
                                ngModel.$pristine = false;
                                element.removeClass(PRISTINE_CLASS).addClass(DIRTY_CLASS);
                                if (parentForm) {
                                    parentForm.$setDirty();
                                }
                                ngModel.$render();
                            }
                        }

                        function clear() {
                            try {
                                if (picker && !keepDisplaying) {
                                    picker.remove();
                                    picker = null;
                                }
                                if (container && !keepDisplaying) {
                                    container.remove();
                                    container = null;
                                }
                            } catch (ex) { }
                            finally {
                                try {
                                    if (!keepDisplaying) {
                                        //element.blur();
                                    }
                                } catch (e) { }
                            }
                        }

                        function showPicker() {
                            if (picker) {
                                return;
                            }
                            // create picker element
                            picker = $compile(template)(scope);
                            scope.$digest();

                            scope.$on('setDate', function (event, date, view) {
                                //$timeout(function () {
                                updateInput(event);
                                if (dismiss && views[views.length - 1] === view) {
                                    clear();
                                    element.blur();
                                }
                                //}, 50);
                            });

                            scope.$on('$destroy', clear);

                            // move picker below input element

                            if (position === 'absolute') {
                                var pos = angular.extend($(element).offset(), { height: element[0].offsetHeight });
                                picker.css({ top: pos.top + pos.height, left: pos.left, display: 'inline-block', position: position });
                                body.append(picker);
                            } else {
                                // relative
                                container = angular.element('<div date-picker-wrapper class="floating"></div>');
                                element[0].parentElement.insertBefore(container[0], element[0]);
                                container.append(picker);
                                //          this approach doesn't work
                                //          element.before(picker);
                                picker.css({ top: element[0].offsetHeight + 'px', display: 'inline-block' });
                            }

                            picker.bind('mousedown', function (evt) {
                                evt.preventDefault();
                                element.off('blur');
                            });

                            picker.bind('mouseup', function (evt) {
                                evt.preventDefault();
                                element.on('blur', clear);
                            });
                        }

                        element.bind('focus', showPicker);
                        element.on('blur', clear);
                    }
                };
            }]);

            loaded = true;
        }
    });
})();