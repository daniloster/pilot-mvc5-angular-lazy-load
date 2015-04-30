(function () {
    var loaded = false, active = null, check = function (items, itemPath) {
        items.each(function (index, item) {
            checkItem(item, itemPath);
        });
    }, checkItem = function (item, itemPath) {
        if (item.attr('href').replace('/#/', '/') == itemPath.replace('/#/', '/')) {
            item.parent().addClass('active');
        } else {
            item.parent().removeClass('active');
        }
    };
    define(['angular', 'app'], function (angular, app) {
        if (!loaded) {
            app.lazy.directive("navCheck", ['ConfigApp', '$location', function (configApp, $location) {
                angular.element('body').after(angular.element('<link href="' + configApp.getPath('/Content/Scripts/components/common/navMenu/style.css') + '" type="text/css" rel="stylesheet" />'));
                return {
                    restrict: 'A',
                    link: function ($scope, elem, attrs) {

                        elem.on('click', function () {
                            active = elem.attr('href');
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