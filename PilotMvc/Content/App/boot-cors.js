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

    var requireConfig = {
        baseUrl: appSettings.baseUrl + '/Content/App',
        enforceDefine: true,
        //urlArgs: "bust=" + (new Date()).getTime(),
        //waitSeconds: 200,
        paths: {
            'html5shiv': 'https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min',
            'html5': 'http://html5shim.googlecode.com/svn/trunk/html5',
            'json3': 'lib/json3',
            'cors': ['lib/CORS/cors'],
            'xhook': ['lib/CORS/xhook'],
            'xdomain': ['lib/CORS/xdomain']
        },
        shim: {
            html5shiv: {
                exports: 'window'
            },
            html5: {
                exports: 'window'
            },
            json3: {
                exports: 'JSON'
            },
            xdomain: {
                deps: ['json3', 'html5', 'html5shiv']
            }
        },
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
    

