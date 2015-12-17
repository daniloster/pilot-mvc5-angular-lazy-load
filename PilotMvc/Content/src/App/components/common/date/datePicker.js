(function () {
    /*
    <input type="text" date-time ng-model="justDate" views="['date']" format="dd/MM/yyyy" class="just-date" partial="true" readonly required/>
    */
    var loaded = false;
    define(['app'], function (app) {
        if (!loaded) {
            //var Module = angular.module('datePicker', []);

            app.lazy.constant('datePickerConfig', {
                template: '/$base.app.dest/components/common/date/picker.html',
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

                        if (!!attrs.zIndex) {
                            element.css('z-index', attrs.zIndex);
                        }

                        if (scope.unavailableBefore) {
                            scope.unavailableBefore.setHours(0);
                            scope.unavailableBefore.setMinutes(0);
                            scope.unavailableBefore.setSeconds(0);
                            scope.unavailableBefore.setMilliseconds(0);
                            scope.minAvailableDate = new Date(scope.unavailableBefore);
                        }
                        if (scope.unavailableAfter) {
                            scope.unavailableAfter.setHours(0);
                            scope.unavailableAfter.setMinutes(0);
                            scope.unavailableAfter.setSeconds(0);
                            scope.unavailableAfter.setMilliseconds(0);
                            scope.maxAvailableDate = new Date(scope.unavailableAfter);
                        }

                        function refreshTemplate(newValue, oldValue) {
                            if (newValue == oldValue) return;
                            if (scope.unavailableBefore) {
                                scope.minAvailableDate = new Date(scope.unavailableBefore);
                            }
                            if (scope.unavailableAfter) {
                                scope.maxAvailableDate = new Date(scope.unavailableAfter);
                            }
                            if ((scope.unavailableBefore && scope.isUnavailableBefore(scope.date)) || (scope.unavailableAfter && scope.isUnavailableAfter(scope.date)))
                                scope.model = null;
                        }

                        scope.$watch('unavailableAfter', refreshTemplate);
                        scope.$watch('unavailableBefore', refreshTemplate);

                        scope.view = attrs.view || datePickerConfig.view;
                        scope.date = getValidDate(new Date(scope.model || new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())));
                        scope.views = datePickerConfig.views.concat();
                        scope.now = new Date();
                        scope.template = attrs.template || ConfigApp.getPath(datePickerConfig.template);

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
                        function formatNum(number) { return number < 10 ? '0' + number : number; }
                        function unitMonth(date) { return parseInt(date.getFullYear() + '' + formatNum(date.getMonth())); }
                        function unitDate(date) { return parseInt(date.getFullYear() + '' + formatNum(date.getMonth()) + '' + formatNum(date.getDate())); }
                        function getValidDate(date) {
                            date = !!date ? new Date(date) : new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
                            var maxAvailableDate = new Date(scope.maxAvailableDate);
                            if (!!scope.unavailableAfter && date.getFullYear() >= maxAvailableDate.getFullYear()) {
                                if (scope.view == 'year') {
                                    return maxAvailableDate;
                                }
                                else if (unitMonth(date) >= unitMonth(maxAvailableDate)) {
                                    if (scope.view == 'month') {
                                        return maxAvailableDate;
                                    }
                                    else if (scope.view == 'date' && unitDate(date) >= unitDate(maxAvailableDate)) {
                                        return maxAvailableDate;
                                    }
                                }
                            }
                            var minAvailableDate = new Date(scope.minAvailableDate);
                            if (!!scope.unavailableBefore && date.getFullYear() <= minAvailableDate.getFullYear()) {
                                if (scope.view == 'year') {
                                    return minAvailableDate;
                                }
                                else if (unitMonth(date) <= unitMonth(minAvailableDate)) {
                                    if (scope.view == 'month') {
                                        return minAvailableDate;
                                    }
                                    else if (scope.view == 'date' && unitDate(date) <= unitDate(minAvailableDate)) {
                                        return minAvailableDate;
                                    }
                                }
                            }
                            return date;
                        }
                        scope.setDate = function (datep) {
                            var date = getValidDate(datep);
                            var maxAvailableDate = new Date(scope.maxAvailableDate);
                            var minAvailableDate = new Date(scope.minAvailableDate);
                            if (attrs.disabled
                                //|| (scope.isUnavailableAfter(datep)) || (scope.isUnavailableBefore(datep))
                                || (scope.view == 'year' && (!!minAvailableDate && minAvailableDate.getFullYear() > datep.getFullYear()) || (!!maxAvailableDate && maxAvailableDate.getFullYear() < datep.getFullYear()))
                                || (scope.view == 'month' && (!!minAvailableDate && unitMonth(minAvailableDate) > unitMonth(datep)) || (!!maxAvailableDate && unitMonth(maxAvailableDate) < unitMonth(datep)))
                                || (scope.view == 'date' && (!!minAvailableDate && unitDate(minAvailableDate) > unitDate(datep)) || (!!maxAvailableDate && unitDate(maxAvailableDate) < unitDate(datep)))
                                ) {
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
                        scope.clearSelectedDate = function () {
                            scope.date = null;
                            applyValue(null);
                            scope.$emit('setDate', scope.model, scope.view);
                        };

                        scope.isValidDate = function (day) {
                            return day.getTime() == getValidDate(day).getTime();
                        };

                        function update() {
                            var view = scope.view;
                            var date = scope.date;
                            switch (view) {
                                case 'year':
                                    scope.years = datePickerUtils.getVisibleYears(getValidDate(date));
                                    break;
                                case 'month':
                                    scope.months = datePickerUtils.getVisibleMonths(getValidDate(date));
                                    break;
                                case 'date':
                                    scope.weekdays = scope.weekdays || datePickerUtils.getDaysOfWeek();
                                    scope.weeks = datePickerUtils.getVisibleWeeks(getValidDate(date));
                                    break;
                                case 'hours':
                                    scope.hours = datePickerUtils.getVisibleHours(getValidDate(date));
                                    break;
                                case 'minutes':
                                    scope.minutes = datePickerUtils.getVisibleMinutes(getValidDate(date), step);
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
                            auxDate = new Date(date);
                            delta = delta || 1;
                            switch (scope.view) {
                                case 'year':
                                    if (!!scope.years && scope.years.length > 0) {
                                        if (delta > 0) {
                                            auxDate.setFullYear(scope.years[scope.years.length - 1].getFullYear() + 1);
                                        }
                                        else if (delta < 0) {
                                            auxDate.setFullYear(scope.years[0].getFullYear() - 1);
                                        }
                                    }
                                    if (!scope.isValidDate(auxDate))
                                        return;
                                    date.setFullYear(date.getFullYear() + delta);
                                    break;
                                case 'month':
                                    if (!!scope.months && scope.months.length > 0) {
                                        if (delta > 0) {
                                            auxDate = new Date(scope.months[scope.months.length - 1]);
                                            auxDate.setMonth(auxDate.getMonth() + 1);
                                        }
                                        else if (delta < 0) {
                                            auxDate = new Date(scope.months[0]);
                                            auxDate.setMonth(auxDate.getMonth() - 1);
                                        }
                                    }
                                    //auxDate.setFullYear(auxDate.getFullYear() + delta);
                                    if (!scope.isValidDate(auxDate))
                                        return;
                                    date.setFullYear(date.getFullYear() + delta);
                                    break;
                                case 'date':
                                    if (!!scope.weeks && scope.weeks.length > 0) {
                                        if (delta > 0) {
                                            auxDate = new Date(scope.weeks[scope.weeks.length - 1][6]);
                                            auxDate.setDate(auxDate.getDate() + 1);
                                        }
                                        else if (delta < 0) {
                                            auxDate = new Date(scope.weeks[0][0]);
                                            auxDate.setDate(auxDate.getDate() - 1);
                                        }
                                    }
                                    //auxDate.setMonth(auxDate.getMonth() + delta);
                                    if (!scope.isValidDate(auxDate))
                                        return;
                                    date.setMonth(date.getMonth() + delta);
                                    break;
                                case 'hours':
                                    /*falls through*/
                                case 'minutes':
                                    auxDate.setHours(auxDate.getHours() + delta);
                                    if (!scope.isValidDate(auxDate))
                                        return;
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
                            return scope.unavailableAfter && date.getTime() != new Date(scope.unavailableAfter).getTime() && datePickerUtils.isBefore(date, new Date(scope.unavailableAfter));
                        };

                        scope.isUnavailableBefore = function (date) {
                            return scope.unavailableBefore && date.getTime() != new Date(scope.unavailableBefore).getTime() && datePickerUtils.isAfter(date, new Date(scope.unavailableBefore));
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
                    templateUrl: ConfigApp.getPath('/$base.app.dest/components/common/date/range.html'),
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
                        'date-picker="$parent.' + attrs.ngModel + '" ' +
                        (attrs.view ? 'view="' + attrs.view + '" ' : '') +
                        (attrs.maxView ? 'max-view="' + attrs.maxView + '" ' : '') +
                        (attrs.template ? 'template="' + attrs.template + '" ' : '') +
                        (attrs.minView ? 'min-view="' + attrs.minView + '" ' : '') +
                        (attrs.partial ? 'partial="' + attrs.partial + '" ' : '') +
                        (attrs.zIndex ? 'z-index="' + attrs.zIndex + '" ' : '') +
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
                angular.element('body').after(angular.element('<link href="' + ConfigApp.getPath('/$base.app.dest/components/common/date/style.css') + '" type="text/css" rel="stylesheet" />'));

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