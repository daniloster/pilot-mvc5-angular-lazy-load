(function () {
    var loaded = false;
    define(['app', 'angular'], function (app, angular) {
        if (!loaded) {

            app.lazy.factory("PositionService", function () {
                return {
                    global: function (element) {
                        var pos = element.offset();
                        return {
                            top: pos.top,
                            left: pos.left
                        }
                    }
                }
            });

            app.lazy.factory("AlignService", ['PositionService', function (positionSvc) {
                return {
                    pos: function (element, tooltip, align) {
                        //get dimensions including padding+border
                        var elHeight = element.outerHeight();
                        var elWidth = element.outerWidth();
                        var ttWidth = tooltip.outerWidth();
                        var ttHeight = tooltip.outerHeight();
                        var elPos = positionSvc.global(element);
                        switch (align) {
                            case 'left':
                                pos = {
                                    top: elPos.top + elHeight / 2 - ttHeight / 2,
                                    left: elPos.left - ttWidth
                                };
                                break;
                            case 'right':
                                pos = {
                                    top: elPos.top + elHeight / 2 - ttHeight / 2,
                                    left: elPos.left + elWidth
                                };
                                break;
                            case 'bottom':
                                pos = {
                                    top: elPos.top + elHeight,
                                    left: elPos.left + elWidth / 2 - ttWidth / 2
                                };
                                break;
                            default: //top
                                pos = {
                                    top: elPos.top - ttHeight,
                                    left: elPos.left + elWidth / 2 - ttWidth / 2
                                };
                                break;
                        }
                        return pos;
                    }
                }
            }]);

            app.lazy.directive("tooltip", ['$compile', 'AlignService', 'ConfigApp', function ($compile, alignSvc, configApp) {
                angular.element('body').after(angular.element("<link rel='stylesheet' type='text/css' href='" + configApp.getPath("/Content/Scripts/components/common/tooltip/style.css") + "'/>"));
                var template =
                 '<div class="tooltip">' +
                   '<p>{{message}}</p>' +
                 '</div>';
                return {
                    scope: {
                        message: "@tooltip"
                    },
                    link: function (scope, element, attrs) {
                        var tooltip;
                        //scope.message = attrs.ngTooltip;
                        var align = attrs.tooltipAlign;
                        function remove() {
                            if (tooltip) {
                                tooltip.remove();
                                tooltip = null;
                            }
                        };

                        function show() {
                            tooltip = angular.element(attrs.tooltipTemplate || template);
                            element.after(tooltip);

                            $compile(tooltip)(scope);
                            scope.$digest();

                            var pos = alignSvc.pos(element, tooltip, align);
                            tooltip.css({ top: pos.top, left: pos.left });

                            tooltip.hide().fadeIn();
                        }

                        element.bind("mouseenter", function () {
                            remove();
                            show();
                        })

                        element.bind("mouseleave", function () {
                            remove();
                        })
                    }
                }
            }]);

            loaded = true;
        }
    });
})();
