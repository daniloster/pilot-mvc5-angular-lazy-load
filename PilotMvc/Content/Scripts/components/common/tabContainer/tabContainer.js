(function () {
    var loaded = false;
    /**
    HOW TO USE IT ON YOUR PAGE

    <div ng-controller="MyController">
        <div tab-container="tabs" tab-index-default="<optional:index|default:0>" tab-alignment="<left|right|default:right>"></div>
    </div>

    function MyController() {
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
    
    */

    define(['require', 'angular', 'app', 'components/common/loading/loadingController'], function (require, angular, app, loadingController) {
        if (!loaded) {
            app.lazy.directive("tabContainer", ['ConfigApp', function (ConfigApp) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/tabContainer/style.css')));
                return {
                    controller: ['$scope', function ($scope) {
                        
                        $scope.showTab = function (index) {
                            require(($scope.tabs[index].dependencies || []), function () {

                                $scope.$apply(function () {
                                    $scope.tabIndexDefault = index;
                                    $scope.tabs[index].templateLoaded = $scope.tabs[index].template;
                                });

                            });
                        };
                    }],
                    restrict: 'EA',
                    templateUrl: ConfigApp.getPath('/Content/Scripts/components/common/tabContainer/template.html'),
                    scope: {
                        tabs: "=tabContainer",
                        tabIndexDefault: "@",
                        tabAlignment: "@"
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