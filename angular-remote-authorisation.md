#### Parenthesis for remote authorisation with angular while navigating

```Javascript

$routeProvider.when('your_path', { 
  templateUrl: 'path/to/my/template.myExtesion',
  isPublic: false,
  title: "My page title",
  resolve: {
    // here you add keys related to NamedFactories or the proper factory definition, according 
    // to my tests, I would advice to create a provider with a method to create different 
    // definition instances. It may used to load some dependencies or whatever else. Why this? 
    // When I was registering my routes using the same definition, once any URL is resolved, 
    // it keeps like that for any other. Create different definitions, angular must create  
    // different instances of resolver having, in this case, one for each route defined.
    // Remind that factory must return a promise. It is what ensure that the user just will have 
    // access once the promise is resolved.
    authorisation: 'MyAuthorisationResolver'
  }  
}

app.lazy.provider('MyAuthorisationResolver', (function myAuthorisationResolverProvider() {
  this.defineResolver = function (id) {
    return ['$q', '$route', '$location', '$rootScope', 'AuthorisationService',
    function ($q, $route, $location, $rootScope, authorisationService) {
      // authorisationService: it has a method to authorise navigation according to path 
      // the authenticated user wants to access. autho
      var self = this;
      self.createDefinition = function () {
        var deferred = $q.defer(), authorised = $q.defer(), path = $location.path(), redirect,
        /*@type isPublic <Booelan>*/
        isPublic = $route.current.isPublic || ($route.current.isPublic == undefined),
        /*@type title <String>*/
        title = $route.current.title || undefined;
        
        redirect = function (routeForUnauthorisedAccess) {
          //If user does not have required access, we will route the user to unauthorised access page
          $location.path(routeForUnauthorisedAccess);
          //As there could be some delay when location change event happens, 
          //we will keep a watch on $locationChangeSuccess event
          // and would resolve promise when this event occurs.
          $rootScope.$on('$locationChangeSuccess', function (next, current) {
            deferred.resolve();
          });
        }

        deferred.promise.then(function () {
          if (title !== undefined) {
            $rootScope.title = title;
          }
          authorised.resolve();
        }, function () {
          // redirect to not authorized page
          redirect('/not-authorised');
        });
        
        self.hasPermission = function(data){
          return data.granted === true;
        };
        
        if (!!isPublic || (!globalActive && id === 'global')) {
          deferred.resolve();
        } else {
          // In that case, it is necessary to load the user from session
          authorisationService.authoriseAccess({ path: path }, function (data) {
            if (self.hasPermission(data)) {
              deferred.resolve();
            } else {
              // redirect to not authorised page
              deferred.reject();
            }
          }, function (data) {
            // redirect to login page
            redirect('/login');
          });
        }
        return authorised.promise;
      };
      return self.resolve();
    }];
  };

  self.$get = self.createDefinition();
}));

```
