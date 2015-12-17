define(['lib/IE/isIE', 'lib/IE/isIE8', 'lib/IE/isIE9', 'lib/IE/isIE11', 'xdomain', 'xhook', 'util/array', 'util/string', 'util/object', 'util/date'], function (isIE, isIE8, isIE9, isIE11, xdomain, xhook) {

    /*
    how to use the requirejs

    <script 
        data-main="main" 
        data-is-debugging="true" 
        data-wrap-html="true" 
        data-handle-routes="true" 
        src="/$base.app.dest/lib/component-require.min.js"></script>

        <script 
        data-main="main" 
        data-is-debugging="true" 
        data-wrap-html="true" 
        data-handle-routes="true" 
        data-component-name="comp1,comp2"
        src="/$base.app.dest/lib/component-require.min.js"></script>
    */

    if (isIE) {
        // Angular required elements
        document.createElement('ng-include');
        document.createElement('ng-pluralize');
        document.createElement('ng-view');

        // Optionally these for CSS
        document.createElement('ng:include');
        document.createElement('ng:pluralize');
        document.createElement('ng:view');

        // HTML5 elements
        document.createElement('header');
        document.createElement('nav');
        document.createElement('section');
        document.createElement('article');
        document.createElement('aside');
        document.createElement('footer');

        // Custom elements
        document.createElement('map');
        document.createElement('shape');
    
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

    function init() {
        var modules = ['angular', 'app', 'config', 'util'];
        (appSettings.componentName || []).forEach(function (item) {
            modules.push(item);
        });

        require(modules, function (angular, app) {
            angular.element(document).ready(function () {
                appSettings.htmlTarget.forEach(function (htmlTarget) {
                    angular.bootstrap(htmlTarget === 'document' ? document : htmlTarget, [app['name']]);
                });
            });
        });
    }

    function loadJquery() {
        require(['jq'], function ($) {
            //fix jquery cors
            $.support.cors = true;

            var html, head, httpEquiv, css;
            
            html = $('html');
            html.attr('xmlns:ng', 'http://angularjs.org');
            html.attr('id', 'ng-app');

            head = $('head');

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

            init();

        });
    }

});