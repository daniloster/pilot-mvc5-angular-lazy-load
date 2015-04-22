(function () {
    var loaded = false, active = null, check = function (items, itemPath) {
        items.each(function (item, index) {
            checkItem(item, itemPath);
        });
    }, checkItem = function (item, itemPath) {
        if (item.attr('href') == itemPath) {
            item.addClass('nav-item-selected');
        } else {
            item.removeClass('nav-item-selected');
        }
    };
    define(['angular', 'app'], function (angular, app) {
        if (!loaded) {
            app.lazy.directive("navCheck", ['ConfigApp', function (configApp) {
                angular.element('body').after(angular.element('<link href="' + configApp.getPath('/Content/Scripts/components/common/navMenu/style.css') + '" type="text/css" rel="stylesheet" />'));
                return {
                    restrict: 'A',
                    link: function ($scope, elem, attrs) {

                        elem.on('click', function () {
                            active = elem.attr('href');
                            check($('[nav-check]'), active);
                        });

                        checkItem(item, itemPath);
                    }
                };
            }]);
            loaded = true;
        }
    });
})();