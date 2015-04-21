define(['lib/IE/isIE', 'util/array', 'util/string'], function (isIE) {
    if (isIE) {
        // Angular required elements
        document.createElement('ng-include');
        document.createElement('ng-pluralize');
        document.createElement('ng-view');

        // Optionally these for CSS
        document.createElement('ng:include');
        document.createElement('ng:pluralize');
        document.createElement('ng:view');

        // HTML elements
        document.createElement('header');
        document.createElement('nav');
        document.createElement('section');
        document.createElement('article');
        document.createElement('aside');
        document.createElement('footer');

        // Custom elements
        document.createElement('loading');
        document.createElement('pagination');
        document.createElement('menu-fixed');
        document.createElement('modal-dialog');
        document.createElement('date-picker');
        document.createElement('workflow-footer');
        document.createElement('color-picker');
        document.createElement('text-style-editor');
        document.createElement('img-upload');

        document.createElement('my-editor');
    }

    require(['jquery'], function ($) {

        function init() {
            require(['angular', 'app', 'util'], function (angular, app) {
                angular.element(document).ready(function () {
                    //var elements = $('culturefox-viewer');
                    //angular.bootstrap(elements.length ? $('culturefox-viewer').parent()[0] : document, [app['name']]);
                    angular.bootstrap(document, [app['name']]);
                });
            });
        }

        function load() {
            var head = $('head');

            css = '<link href="//maxcdn.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet">';
            head.append(css);

            var _base, css;
            try {
                _base = baseUrl || '';
                if (!!_base) {
                    css = '<link type="text/css" rel="stylesheet" href="' + _base + '/Content/Styles/common.css" />';
                    head.append(css);
                }
                if (isIE) {
                    css = '<link type="text/css" rel="stylesheet" href="' + _base + '/Content/Styles/ie-general-fixes.css" />';
                    head.append(css);
                }
            } catch (e) {
                css = '<link type="text/css" rel="stylesheet" href="/Content/Styles/common.css" />';
                head.append(css);

                if (isIE) {
                    css = '<link type="text/css" rel="stylesheet" href="/Content/Styles/ie-general-fixes.css" />';
                    head.append(css);
                }
            }

            var html, httpEquiv, viewport;
            try {
                html = $('html');
                html.attr('xmlns:ng', 'http://angularjs.org');
                html.attr('id', 'ng-app');
            } catch (e) { console.log(e); }

            try {
                head = $('head');
                httpEquiv = head.find('meta[http-equiv]');
                if (httpEquiv.length) {
                    httpEquiv.attr('http-equiv', 'X-UA-Compatible');
                    httpEquiv.attr('content', 'IE=edge,chrome=1');
                } else {
                    head.append('<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">');
                }
            } catch (e) { console.log(e); }

            try {
                viewport = $('meta[name=viewport]');
                if (viewport.length) {
                    viewport.attr('content', 'width=device-width, initial-scale=1, maximum-scale=1');
                } else {
                    head.append('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">');
                }
            } catch (e) { console.log(e); }

            init()
        }

        if (isIE) {

            require(['html5shiv', 'respond', 'html5', 'json3'], function () {
                load();
            });

        } else {
            load();
        }

    });
});