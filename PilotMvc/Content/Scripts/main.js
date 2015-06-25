define(['lib/IE/isIE', 'lib/IE/isIE8', 'lib/IE/isIE9', 'lib/IE/isIE11', 'xdomain', 'xhook', 'util/array', 'util/string'], function (isIE, isIE8, isIE9, isIE11, xdomain, xhook) {

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
        document.createElement('page-footer');
        document.createElement('menu-fixed');
        document.createElement('modal-dialog');
        document.createElement('date-picker');
        document.createElement('workflow-footer');
        document.createElement('color-picker');
        document.createElement('text-style-editor');
        document.createElement('img-upload');

        document.createElement('map');
        document.createElement('shape');

        document.createElement('my-editor');
    }

    var loadJquery = function () {
        require(['jq'], function ($) {
            var elements = $('[xxxxx-component-attr]');
            if (elements.length == 0) {
                $('[src="' + baseUrl + '/Content/Scripts/lib/component-require.min.js"]').siblings().each(function (idx, item) {
                    if (item.nodeName.toUpperCase() == "XXXXX-COMPONENT-ATTR") {
                        elements = $(item);
                    }
                });
            }
            var doc = appSettings.applyForAllDocument || elements.length == 0 ? document : elements;

            //fix jquery cors
            $.support.cors = true;

            function init() {
                require(['angular', 'app', 'config', 'util'], function (angular, app) {
                    angular.element(document).ready(function () {
                        angular.bootstrap(doc, [app['name']]);
                    });
                });
            }

            var html, head, httpEquiv, viewport, css;
            try {
                html = $('html');
                html.attr('xmlns:ng', 'http://angularjs.org');
                html.attr('id', 'ng-app');
            } catch (e) { console.log(e); }

            try {
                head = $('head');

                //css = '<link href="//maxcdn.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet">';
                css = '<link href="' + baseUrl + '/Content/Styles/bootstrap.min.css?ngBust=' + appSettings.ngBust + '" rel="stylesheet">';
                head.append(css);

                css = '<link href="' + baseUrl + '/Content/Styles/app.css?ngBust=' + appSettings.ngBust + '" rel="stylesheet">';
                head.append(css);

                css = '<link href="' + baseUrl + '/Content/Styles/checkbox.css?ngBust=' + appSettings.ngBust + '" rel="stylesheet">';
                head.append(css); 

                css = '<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet">';
                head.append(css);

                httpEquiv = head.find('meta[http-equiv]');
                if (httpEquiv.length) {
                    httpEquiv.attr('http-equiv', 'X-UA-Compatible');
                    if (!isIE8 && !isIE9) {
                        httpEquiv.attr('content', 'IE=edge,chrome=1');
                    }
                } else {
                    head.attr('no-http-equiv', 'true');

                    if (!isIE8 && !isIE9) {
                        head.append('<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">');
                    }
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

            init();

        });
    };

    if (isIE) {
        require(['html5shiv', 'html5', 'json3'], function () {
            require(['respond'], function () {
                var params = {};
                params[baseUrl] = '/proxy.html';
                xdomain.slaves(params);

                //fix trackers
                xhook.addWithCredentials = false;
                //enabling debug
                xdomain.debug = true;

                loadJquery();
            });
        });
    } else {
        loadJquery();
    }
});