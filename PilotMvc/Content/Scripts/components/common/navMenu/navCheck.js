(function () {
    var loaded = false, check = function (items, itemPath) {
        items.each(function (index, item) {
            checkItem($(item), itemPath);
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
            app.lazy.directive("navCheck", ['ConfigApp', '$location', function (ConfigApp, $location) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/navMenu/style.css')));
                return {
                    restrict: 'A',
                    link: function ($scope, elem, attrs) {

                        var active = elem.attr('href');

                        elem.on('click', function () {
                            check($('[nav-check]'), active);
                        });

                        checkItem($(elem), $location.path());
                    }
                };
            }]);
            loaded = true;
        }
    });
})();