﻿(function () {
    var Manager = null, instance = null, 
        hasLoads = [], overlay = false;
        instance = {
            clear: function (hasOverlay) {
                hasLoads = [];
                overlay = !!hasOverlay;
            },
            isLoading: function () {
                return hasLoads.length > 0;;
            },
            startLoading: function () {
                hasLoads.push(1);
            },
            stopLoading: function () {
                hasLoads.pop();
            },
            hasOverlay: function () {
                return overlay;
            },
            enableOverlay: function () {
                overlay = true;
            },
            disableOverlay: function () {
                overlay = false;
            }
        };
    define(['app'], function (app) {
        if (Manager == null) {

            Manager = [function () {
                return instance;
            }];

            app.lazy.factory('LoadingManager', Manager);
        }
    });
})();