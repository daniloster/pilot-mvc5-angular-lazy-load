define(['extensions'], function () {
    require(['jquery', 'lib/IE/isIE'], function ($, isIE) {
        var html = $('html'), head = $('head');
        html.attr('xmlns:ng', 'http://angularjs.org');
        html.attr('id', 'ng-app');


        var httpEquiv = head.find('meta[http-equiv]'), viewport = $('meta[name=viewport]');
        if (httpEquiv.length) {
            httpEquiv.attr('http-equiv', 'X-UA-Compatible');
            httpEquiv.attr('content', 'IE=edge,chrome=1');
        } else {
            head.append('<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">');
        }


        if (viewport.length) {
            viewport.attr('content', 'width=device-width, initial-scale=1, maximum-scale=1');
        } else {
            head.append('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">');
        }

        function init() {
            require(['angular', 'app', 'util'], function (angular, app) {
                angular.element(document).ready(function () {
                    angular.bootstrap(document, [app['name']]);
                });
            });
        }

        if (isIE) {

            require(['html5shiv', 'respond', 'html5', 'json3'], function () {
                // Angular required elements
                document.createElement('ng-include');
                document.createElement('ng-pluralize');
                document.createElement('ng-view');

                // Optionally these for CSS
                document.createElement('ng:include');
                document.createElement('ng:pluralize');
                document.createElement('ng:view');

                // Custom elements
                document.createElement('loading');
                document.createElement('pagination');
                document.createElement('page-footer');
                document.createElement('menu-fixed');
                document.createElement('modal-dialog');
                document.createElement('date-picker');
                document.createElement('workflow-footer');
                document.createElement('culturefox-viewer');
                document.createElement('categories');
                document.createElement('counties');
                document.createElement('venues');
                document.createElement('color-picker');
                document.createElement('text-style-editor');

                document.createElement('my-editor');

                init();
            });

        } else {
            init();
        }

    });
});