(function () {
    var loaded = false;
    /**
    HOW TO USE IT ON YOUR PAGE

    <div ng-controller="MyController">
        <div tab-container="tabs" tab-index-default="<optional:index|default:0>" tab-alignment="<left|right|default:right>"></div>
    </div>

    // Without changing route path
    function MyController($scope) {
        $scope.tabs = [{
            image: '/Content/Template/Images/myimage1.png',
            title: 'Tab 1',
            template: '/Content/Scripts/path/to/page1.html'
            dependencies: ['controllers/MyFirstController'] // REQUIREJS + ANGULAR dependencies
        },
        {
            image: '/Content/Template/Images/myimage2.png',
            title: 'Tab 2',
            template: '/Content/Scripts/path/to/page2.html'
            dependencies: ['controllers/MySecondController'] // REQUIREJS + ANGULAR dependencies
        }];
    }

    //With changing route path
    function MyController($scope, $routeParams, $location) {
        $scope.tabs = [{
            name: 'tab1',
            onActivating: function () {
                $location.path('/prefixRoute/tab1');
            },
            image: '/Content/Template/Images/myimage1.png',
            title: 'Tab 1',
            template: '/Content/Scripts/path/to/page1.html'
            dependencies: ['controllers/MyFirstController'] // REQUIREJS + ANGULAR dependencies
        },
        {
            name: 'tab2',
            onActivating: function () {
                $location.path('/prefixRoute/tab2');
            },
            image: '/Content/Template/Images/myimage2.png',
            title: 'Tab 2',
            template: '/Content/Scripts/path/to/page2.html'
            dependencies: ['controllers/MySecondController'] // REQUIREJS + ANGULAR dependencies
        }];
        
        $scope.currentTabIndex = (!$routeParams.tabName ? 0 : ($scope.tabs.getIndex(function (tab) {
            return tab.name === $routeParams.tabName;
        })));
    }

    // changin route path requires a mapping like this below
    $routeProvider.when("/prefixRoute/:tabName?", {
        params: { tabName: 'tab1' }, // default value in case of null
        templateUrl: '/Content/Scripts/path/to/page-with-tabs.html'
    });
    
    */

    define(['require', 'angular', 'app', 'components/common/loading/loadingController'], function (require, angular, app, loadingController) {
        if (!loaded) {
            app.lazy.directive("tabContainer", ['ConfigApp', function (ConfigApp) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/tabContainer/style.css')));
                return {
                    controller: ['$scope', '$rootScope', '$route', function ($scope, $rootScope, $route) {

                        var lastRoute = $route.current;
                        $scope.$on('$locationChangeSuccess', function (event) {
                            if ($route.current.$$route.templateUrl === lastRoute.templateUrl) {
                                // Will not load only if my view use the same controller
                                $route.current = lastRoute;
                            }
                        });

                        $scope.showTab = function (index) {
                            require(($scope.tabs[index].dependencies || []), function () {
                                $scope.$apply(function () {
                                    $rootScope.clearMessages();
                                    ($scope.tabs[index].onActivating || function () { })();
                                    $scope.tabs[index].templateLoaded = $scope.tabs[index].template;
                                    $scope.tabIndexDefault = index;
                                });
                            }, function () {
                                $scope.$apply(function () {
                                    $rootScope.updateErrorMessage('');
                                });
                            });
                        };
                    }],
                    restrict: 'EA',
                    templateUrl: ConfigApp.getPath('/Content/Scripts/components/common/tabContainer/template.html'),
                    scope: {
                        tabs: "=tabContainer",
                        tabIndexDefault: "=?",
                        tabAlignment: "=?"
                    },
                    link: function ($scope, elem, attrs) {
                        $scope.showTab(isNaN($scope.tabIndexDefault) ? 0 : parseInt($scope.tabIndexDefault));
                    }
                };
            }]);
            loaded = true;
        }
    });
})();