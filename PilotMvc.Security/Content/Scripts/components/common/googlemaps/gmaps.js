(function () {
    define(['jq', 'async!http://maps.google.com/maps/api/js?v=3&sensor=false'], function ($) {
        return {
            addMapToCanvas: function (mapCanvasSelector) {
                var myOptions = {
                    center: new google.maps.LatLng(-34.397, 150.644),
                    zoom: 8,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                var map = new google.maps.Map($(mapCanvasSelector)[0], myOptions);
            }
        }
    });
})();