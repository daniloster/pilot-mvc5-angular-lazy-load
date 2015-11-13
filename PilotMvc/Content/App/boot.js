var appSettings = (function (window, appSettings) {
    var console;
    try { window.console.log('IE'); console = window.console; } catch (e) { window.console = console = ({ log: function () { } }); }
    appSettings = {
        baseUrl: 'http://localhost:51949',
        //baseUrl: 'http://staging-journal-irn.mediaonesupport.com',
        //baseUrl: 'http://staging-irn.mediaonesupport.com',
        angularjsv: '1.4.0'/*1.2.9*//*1.2.27*/,
        htmlTarget: ['document'],
        handleRoutes: false,
        ngBust: (new Date()).getTime(),
        sessionTimeout: 30,
        debug: true,
        componentName: []
    };

    (function () {
        var scripts = document.scripts, currentScript;
        try {
            for (var i = 0, len = scripts.length; i < len; i++) {
                currentScript = scripts[i];
                if (!appSettings.componentName.length && !!currentScript.getAttribute('data-crossdomain-component')) {
                    appSettings.componentName = currentScript.getAttribute('data-crossdomain-component').split(',');
                }
                if (!appSettings.htmlTarget.length && !!currentScript.getAttribute('data-html-target')) {
                    appSettings.htmlTarget = currentScript.getAttribute('data-html-target').split(',');
                }
                if (!appSettings.handleRoutes) {
                    appSettings.handleRoutes = currentScript.getAttribute('data-handle-routes');
                    appSettings.handleRoutes = appSettings.handleRoutes === "true";
                }
                if (!appSettings.debug) {
                    appSettings.debug = currentScript.getAttribute('data-is-debugging');
                    appSettings.debug = appSettings.debug === "true";
                }
            }
        } catch (e) {
            console.log(e);
        }
        appSettings.handleRoutes = appSettings.handleRoutes === true || appSettings.handleRoutes === undefined;
        appSettings.debug = appSettings.debug === true || appSettings.debug === undefined;
    })();

    var requireConfig = {
        baseUrl: appSettings.baseUrl + '/Content/App',
        enforceDefine: true,
        //urlArgs: "bust=" + (new Date()).getTime(),
        //waitSeconds: 200,
        paths: {
            'modernizr': 'lib/modernizr.min',
            'html5shiv': 'https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min',
            //'respond': 'https://oss.maxcdn.com/respond/1.4.2/respond.min',
            'respond': 'lib/respond/respond',
            'html5': 'http://html5shim.googlecode.com/svn/trunk/html5',
            'json3': 'lib/json3',
            'xhook': ['lib/CORS/xhook'],
            'xdomain': ['lib/CORS/xdomain'],
            'bootstrap': ['https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min', 'lib/bootstrap.min'],
            //'jquery': ['https://code.jquery.com/jquery-2.1.1.min', 'lib/jQuery/jquery-2.min'],
            'jqStandard': ['https://code.jquery.com/jquery-1.11.1.min', 'lib/jQuery/jquery-1.11.1.min'],
            'jq': 'lib/jQuery/jQueryNoConflict',
            'jqColorPicker': 'lib/jQuery/colpick',
            'jqXdr': 'lib/jQuery/xdr',
            'angular': ['//ajax.googleapis.com/ajax/libs/angularjs/' + appSettings.angularjsv + '/angular.min', 'lib/angularjs/angular.min'],
            'ngRoute': ['//ajax.googleapis.com/ajax/libs/angularjs/' + appSettings.angularjsv + '/angular-route.min', 'lib/angularjs/angular-route.min'],
            'ngResource': ['//ajax.googleapis.com/ajax/libs/angularjs/' + appSettings.angularjsv + '/angular-resource.min', 'lib/angularjs/angular-resource.min'],
            'ngMocks': ['//ajax.googleapis.com/ajax/libs/angularjs/' + appSettings.angularjsv + '/angular-mocks', 'lib/angularjs/angular-mocks'],
            'ngCookies': ['//ajax.googleapis.com/ajax/libs/angularjs/' + appSettings.angularjsv + '/angular-cookies.min', 'lib/angularjs/angular-cookies.min'],
            'ngAnimate': ['//ajax.googleapis.com/ajax/libs/angularjs/' + appSettings.angularjsv + '/angular-animate.min', 'lib/angularjs/angular-animate.min'],
            'ngSanitize': ['//ajax.googleapis.com/ajax/libs/angularjs/' + appSettings.angularjsv + '/angular-sanitize.min', 'lib/angularjs/angular-sanitize.min'],
            'ngMessages': ['//ajax.googleapis.com/ajax/libs/angularjs/' + appSettings.angularjsv + '/angular-messages.min', 'lib/angularjs/angular-messages.min'],
            'async': 'lib/requirejs.async'
        },
        shim: {
            html5shiv: {
                exports: 'window'
            },
            respond: {
                exports: 'window'
            },
            html5: {
                exports: 'window'
            },
            json3: {
                exports: 'window'
            },
            bootstrap: {
                exports: 'jQuery',
                deps: ['jq']
            },
            jqStandard: {
                exports: 'jQuery'
            },
            jqColorPicker: {
                exports: 'jQuery',
                deps: ['jq']
            },
            modernizr: {
                exports: 'Modernizr'
            },
            'angular': {
                exports: 'angular',
                deps: ['jquery']
            },
            'ngRoute': {
                exports: 'angular',
                deps: ['angular']
            },
            'ngResource': {
                exports: 'angular',
                deps: ['angular']
            },
            'ngMocks': {
                exports: 'angular.mock',
                deps: ['angular']
            },
            'ngCookies': {
                exports: 'angular',
                deps: ['angular']
            },
            'ngAnimate': {
                exports: 'angular',
                deps: ['angular']
            },
            'ngSanitize': {
                exports: 'angular',
                deps: ['angular']
            },
            'ngMessages': {
                exports: 'angular',
                deps: ['angular']
            }
        },
        deps: ['main'],
        js: {
            options: {
                uglify2: {
                    mangle: false
                },
                optimize: 'uglify2'
            }
        }
    };
    requirejs.config(requireConfig);

    return appSettings;
})(window);