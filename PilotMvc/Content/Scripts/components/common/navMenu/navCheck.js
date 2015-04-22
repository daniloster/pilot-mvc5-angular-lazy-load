(function () {
    var loaded = false, active = null, check = function (items, itemPath) {
        items.each(function (index, item) {
            checkItem(item, itemPath);
        });
    }, checkItem = function (item, itemPath) {
        if (item.attr('href').replace('/#/', '/') == itemPath.replace('/#/', '/')) {
            item.parent().addClass('nav-item-selected');
        } else {
            item.parent().removeClass('nav-item-selected');
        }
    };
    define(['angular', 'app'], function (angular, app) {
        if (!loaded) {
            app.lazy.directive("navCheck", ['ConfigApp', '$location', function (configApp, $location) {
                angular.element('body').after(angular.element('<link href="' + configApp.getPath('/Content/Scripts/components/common/navMenu/style.css') + '" type="text/css" rel="stylesheet" />'));
                return {
                    restrict: 'A',
                    link: function ($scope, elem, attrs) {

                        active = elem.attr('href');

                        elem.on('click', function () {
                            check($('[nav-check]'), active);
                        });

                        checkItem(elem, $location.path());
                    }
                };
            }]);
            loaded = true;
        }
    });
})();