(function () {
    var loaded = false;
    define(['angular', 'app'], function (angular, app) {
        if (!loaded) {
            app.lazy.directive("fadeCarousel", ['ConfigApp', '$timeout', function (ConfigApp, $timeout) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/fadeCarousel/style.css')));
                //var templateElement;

                function getTemplateUrl(elem, attr) {
                    attr.templateElement = elem.html();
                    elem.html('');
                    return ConfigApp.getPath('/Content/Scripts/components/common/fadeCarousel/template.html');
                }

                function compile(cElem, cAttrs) {
                    var faderTemplate = cAttrs.templateElement.replaceAll('$item', '$fader'),
                        faderElem = cElem.find('.carousel-fader'),
                        referenceElem = cElem.find('.carousel-reference');

                    referenceElem.append(cAttrs.templateElement);
                    faderElem.append(faderTemplate);

                    return function ($scope, elem, attrs) {
                        $scope.isEquals = function (item1, item2) {
                            if (!!$scope.trackBy && !!item1 && !!item2) {
                                return item1[$scope.trackBy] == item2[$scope.trackBy];
                            } else {
                                return item1 == item2;
                            }
                        };

                        function initCarousel() {
                            if (angular.isArray($scope.items) && $scope.items.length) {
                                $scope.$index = 0;
                                $scope.$item = $scope.items[0];
                                $scope.$fader = $scope.items[0];
                            } else {
                                $scope.$index = null;
                                $scope.$item = null;
                                $scope.$fader = null;
                            }
                        }

                        function changeItem() {
                            if (angular.isArray($scope.items) && $scope.items.length) {
                                var oldItem = $scope.$item;
                                // Cycling $index based on length of the items
                                $scope.$index = (++$scope.$index) % $scope.items.length;
                                // Update new add, this will dispatch the watch
                                $scope.$item = $scope.items[$scope.$index];
                            }
                            triggerChanges();
                        }

                        $scope.$watch('$item', function (nval, oval) {
                            if ($scope.isEquals(nval, oval)) return;
                            // If the fader is still fading out, don't
                            // bother changing the source of the fader;
                            // just let the previous image continue to
                            // fade out.
                            if (isFading()) {
                                //return;
                            }
                            initFade(oval);
                        })

                        function triggerChanges() {
                            $timeout(changeItem, $scope.interval || 5000);
                        }

                        // I prepare the fader to show the previous image
                        // while fading out of view.
                        function initFade(fadeSource) {
                            $scope.$fader = fadeSource;
                            fader.addClass("show");
                            // Don't actually start the fade until the
                            // primary image has loaded the new source.
                            primary.find('img').one("load", startFade);
                        }
                        // I determine if the fader is currently fading
                        // out of view (that is currently animated).
                        function isFading() {
                            return (fader.hasClass("show") || fader.hasClass("fadeOut"));
                        }
                        // I start the fade-out process.
                        function startFade() {
                            // The .width() call is here to ensure that
                            // the browser repaints before applying the
                            // fade-out class (so as to make sure the
                            // opacity doesn't kick in immediately).
                            fader.width();
                            fader.addClass("fadeOut");
                            // if you change this timeout, remember to change the 
                            // css transition interval as well on style.css:
                            // ".carousel-viewport .carousel-fader.show"
                            $timeout(teardownFade, 500);
                        }
                        // I clean up the fader after the fade-out has
                        // completed its animation.
                        function teardownFade() {
                            fader.removeClass("show fadeOut");
                        }

                        var fader = elem.find(".carousel-fader");
                        var primary = elem.find(".carousel-reference");

                        $scope.$watch('items', function (nval, oval) {
                            if (nval == oval) return;
                            initCarousel();
                        });

                        initCarousel();

                        triggerChanges();
                    }
                }

                return {
                    scope:{
                        items: '=carouselItems',
                        interval: '=?carouselInterval',
                        trackBy: '@?carouselTrackBy'
                    },
                    replace: true,
                    restrict: 'EA',
                    templateUrl: getTemplateUrl,
                    compile: compile 
                };
            }]);
            loaded = true;
        }
    });
})();