(function () {
    var loaded = false;
    define(['app'], function (app) {
        if (!loaded) {
            app.lazy.directive("tooltip", ['ConfigApp', function (ConfigApp) {
                return {
                    restrict: 'A',
                    link: function (scope, elem, attrs) {
                        var ttOptions = {
                            content: attrs.tooltip,
                            trigger: attrs.tooltipTrigger || 'hover'
                        };
                        if (!!attrs.tooltipHtml) {
                            ttOptions.html = true;
                        }
                        if (!!attrs.tooltipPlacement) {
                            ttOptions.placement = attrs.tooltipPlacement;
                        }
                        if (!!attrs.tooltipTemplate) {
                            ttOptions.template = attrs.tooltipTemplate;
                        }
                        if (!!attrs.tooltipTitle) {
                            ttOptions.title = attrs.tooltipTitle;
                        }
                        $(elem).popover(ttOptions);
                    }
                };
            }]);
            loaded = true;
        }
    });
})();
/*
$('.tooltip-info').popover();
http://getbootstrap.com/javascript/#popovers
*/