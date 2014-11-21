Pilot C# MVC5 (EF6, AngularJS, RequireJS)
============================
Pilot project integrating MVC5, Entity Framework 6 and front-end based on requirejs and angularjs with lazy load. I'll talk about each part but I'll keep focusing on AngularJS + RequireJS. It is important to understand javascript and closure before going on.

## Roadmap
1. [Purpose](#purpose)
2. [Basic aproaching of modules](#basic-aproaching-of-modules)
  1. [DI (*Dependency injection*)](#dependency-injection)
  2. [ASP MVC5](#asp-mvc5)
    * [What is it? What does it do?](#what-is-it-what-does-it-do)
    * [How do I configure it?](#how-do-i-configure-it)
      * [Literal Mapping in a RouteConfig class](#literal-mapping-in-a-routeconfig-class)
      * [Attribute Mapping in the controller classes](#attribute-mapping-in-the-controller-classes)
    * [Dependency injection with MVC5](#dependency-injection-with-mvc5)
  3. ~~[Javascript](#javascript)~~
    * ~~[First steps](#first-steps)~~ 
    * ~~[Closures](#closures)~~
    * ~~[Best practices](#best-practices)~~
  4. ~~Javascript (AngularJS + RequireJS)~~
    * ~~First steps~~ 
    * ~~Best pratices~~
  5. ~~WCF~~
  6. ~~Services~~
  7. ~~Entity Framework 6~~
  8. ~~Entities (POJO)~~
3. ~~Getting started~~
  1. ~~How to modulate your project~~
  2. ~~Which files should be created~~
  3. ~~How to implement lazy load of controllers and services (factories)~~
4. ~~Contributors~~
5. ~~Come together~~


### Purpose
The idea behind this project is to spread part of my "old bag" and the new knowledge which I've learnt in the last few days. I'd created a challenge for myself and that was the result. The project consist in build a metodology of development with angularjs, in which one I could notice the performance of application and how faster it can be to develop web projects with SPA (*Single Page Application*).
Considering that SPA works with partial rendering, we could aproach in two ways.
* Load your whole application at the first access and show content on demand
* Load your application on demand as long as it is necessary.

For this project, I've taken the second path.

### Basic aproaching of modules
Before we start properly it (I love code first also), we need to understand some basic topics. I'll just give basic concepts about each one. But it is important understand it with your heart. I used to say that everything becomes easy after total understanding of the engines.

### Dependency injection
Firstly, I'll give you some references about the subject and afterwards I'll give my own idea about it. I think that they are pretty similar, but my one will be more condensed. 
[Roadmap of DI, according to MSDN](http://msdn.microsoft.com/en-us/library/dn223671%28v=pandp.30%29.aspx)
[Dependency injection, MSDN](http://msdn.microsoft.com/en-us/library/dn178469(v=pandp.30).aspx)
[Dependency injection with Unity](http://msdn.microsoft.com/en-us/library/dn178463(v=pandp.30).aspx)
So, DI comes from IoC (*Inversion of Control*). IoC basically means that none object can instantiate your dependencies. Then, it can be implemented by many ways, one of them it is DI. We have a lot of frameworks and libraries with DI implementation such as Spring, Dagger, Google Guice - [for Java](https://keyholesoftware.com/2014/02/17/dependency-injection-options-for-java/) -, Unity, Spring.NET, Castle Windsor - [for .NET](http://www.hanselman.com/blog/ListOfNETDependencyInjectionContainersIOC.aspx).
In this project we're going to use Unity to inject the dependencies.

### ASP MVC5

#### What is it? What does it do?
It is a web framework based on assign a URL request to a controller method. In a MVC5 project you can map URLs to base controllers that will return a generic type called ActionResult. As you can see below.
```CSharp

/// Guessing that we have the mapping below in our project, the following 
/// controller has access through the URL: "default/index", it means that
/// you're gonna call Index method inside Default controller.
routes.MapRoute(
    name: "AnyNameItIsLikeAKeyForEachMapping",
    url: "{controller}/{action}"
);


/// Controller named as DefaultController extending a base controller type
public class DefaultController : Controller
{
    /// ActionResult, it is a generic type. In spite of you define return as 
    /// ActionResult, you can return a lot of sub-types as FileContentResult,
    /// ContentResult, JsonResult and so on.
    public ActionResult Index()
    {
        return View("~/Views/Index/Index.cshtml");
    }
}
```
But you can also map URLs to api controllers which ones will answer providing xml and json data. Taking advantage on it, you can build REST services.
In version 5, MVC brings mapping through the attributes (who are used to handle java code, it is the same as annotations).
As you can notice in the following example.
```CSharp
[Route("api/member")]
public class MemberController : ApiController
{
    /// Without Dependency Injection for while
    public MemberService service = new MemberService();
    
    public MemberController() { }

    // GET api/member
    public IEnumerable<Member> Get()
    {
        return Service.Get();
    }
}
```

### How do I configure it?
Mapping routes can be done in two ways.
  * Literal Mapping in a RouteConfig class
  * Attribute Mapping in the controller classes

#### Literal Mapping in a RouteConfig class
In your Global.asax.cs file, on method Application_Start you must have a code like following.
```CSharp
protected void Application_Start()
{
    /// Defining global serializer which one uses Newtonsoft.Json 
    /// to define behaviour in a looping reference
    GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Serialize;
    /// The following two lines are important to configure our routes
    GlobalConfiguration.Configure(RouteConfig.Register);
    RouteConfig.RegisterRoutes(RouteTable.Routes);
    
    BundleConfig.RegisterBundles(BundleTable.Bundles);
}
```
Then, in our RouteConfig file (you can create in any directory, but I'd suggest create that class in a config folder (namespace).
```CSharp
public class RouteConfig
{
    public static void Register(HttpConfiguration config)
    {
        /// Mapping our api controllers
        /// It is important understand the routeTemplate variable
        /// It means that the core web handler will try to match the 
        /// request in order. So, try to create your route from the 
        /// most specific to generic one.
        /// In that URL mapped, we have {controller} which means the 
        /// controller name and it is not case sensitive.
        /// And {id} that is a parameter configured in the next line as optional.
        /// The name of the parameter should match with parameter name on your 
        /// methods, then can be omitted.
        routes.MapHttpRoute(
            name: "DefaultApi",
            routeTemplate: "api/{controller}/{id}",
            defaults: new { id = RouteParameter.Optional }
        );
    }
    
    public static void RegisterRoutes(RouteCollection routes)
    {
        routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
        AreaRegistration.RegisterAllAreas();
        
        /// Mapping our base controllers
        /// In any case, although our controllers are being named meanwhile 
        /// class as MemberController or ContactController, the parameter 
        /// {controller} must omit the word "Controller".
        routes.MapRoute(
            name: "DefaultController",
            url: "{controller}/{action}",
            defaults: new { controller = "Index", action = "Index" }
        );
    }
}
```
Afterwards, we are able to make a request base in these pattern of URLs like "contact/query" for base controller and "api/member/:id" for api controller, but the parameter :id must be changed by a real value.

#### Attribute Mapping in the controller classes
The Global.asax.cs file keeps the same.
```CSharp
protected void Application_Start()
{
    /// Defining global serializer which one uses Newtonsoft.Json 
    /// to define behaviour in a looping reference
    GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Serialize;
    /// The following two lines are important to configure our routes
    GlobalConfiguration.Configure(RouteConfig.Register);
    RouteConfig.RegisterRoutes(RouteTable.Routes);
    
    BundleConfig.RegisterBundles(BundleTable.Bundles);
}
```
Mapping by attribute it is very easy. Instead of routes.MapRoute in our RouteConfig methods, we need to call:
```CSharp
public static void Register(HttpConfiguration config)
{
    config.MapHttpAttributeRoutes();
}

public static void RegisterRoutes(RouteCollection routes)
{
    routes.MapMvcAttributeRoutes();
}
```
And in our controllers, we can map directly on methods or partial on classes and methods as you can see below.
```CSharp
[RoutePrefix("member")]
public class MemberTestController : Controller
{
    private MemberService Service = new MemberService();

    [Route("all")]
    public ActionResult Get()
    {
        return new JsonResultView(Service.Get(), JsonRequestBehavior.AllowGet);
    }

    [Route("get")]
    public ActionResult Get(int id)
    {
        return new JsonResultView(Service.Get(id), JsonRequestBehavior.AllowGet);
    }

    [Route("save")]
    public ActionResult Save(Member member)
    {

        Service.Save(member);
        return new JsonResultView(member, JsonRequestBehavior.AllowGet);
    }
}

public class UserController : Controller
{
    [Route("user/login"), HttpPost, HandleUIException]
    public ActionResult login(string userName, string password)
    {
        object user = null;
        if ("dan".Equals(userName)) {
            if (!"123".Equals(password)) {
                throw new ValidationException("Wrong password!");
            }
            user = new {
                Token = "1",
                Name = "Danilo Castro",
                Email = "danilo@mail.com",
                UserRoles = new int[] { 2, 3 }
            };
        }
        else if ("leti".Equals(userName))
        {
            if (!"123".Equals(password))
            {
                throw new ValidationException("Wrong password!");
            }
            user = new
            {
                Token = "1",
                Name = "Leticia Calmon",
                Email = "leti@mail.com",
                UserRoles = new int[] { 1 }
            };
        }
        else 
        {
            throw new ValidationException("There is no user with this user name!");
        }

        HttpContext.Session.Add("CurrentUser", user);

        return new JsonResultView(user, JsonRequestBehavior.AllowGet);
    }
}
```
It is important notice that the attributes come from namespace "System.Web.Mvc". But to map api controllers you need to reference attributes from namespace "System.Web.Http".
See the following class:
```CSharp
[Route("api/member-beta")] 
/// The methods are automatically related through their names. 
/// They names are assigning to request methods GET, POST, PUT, DELETE.
public class MemberBetaApiController : ApiController
{
    private MemberService service = new MemberService();

    public MemberBetaApiController() { }

    // GET api/member
    public IEnumerable<Member> Get()
    {
        return Service.Get();
    }

    // GET api/member/5
    public Member Get(int id)
    {
        Member member = Service.Get(id);
        if (member == null)
        {
            throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
        }
        return member;
    }
    
    // POST api/member
    public HttpResponseMessage Post(Member member)
    {
        if (ModelState.IsValid)
        {
            Service.Save(member);

            HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, member);
            response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = member.Id }));
            return response;
        }
        else
        {
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
        }
    }
}
```

### Dependency injection with MVC5
I'll start giving a easy reference guide. It is how to implement [Dependency Injection](http://www.codeproject.com/Articles/560798/ASP-NET-MVC-Controller-Dependency-Injection-for-Be) in a beginner perspective.
In our case, we're going to use Unity, but we have a lot of others mechanisms to implement DI as mentioned before.
First step we need to create a class with our settings, our registration. Basically, the DI works registering classes and resolving their interfaces. The injection process can be done by interface matches or binding name, we won't aproach all them. Our case, it is interface matches where we have just one class that implement the respective interface, then that one will be instantiate and set in further dependencies.
Ok! Let's code it!
So, create some classes *Project*->*Config*->*Unity*->*UnityConfig.cs*, in the same directory, *UnityMvcActivator.cs* and *UnityWebApiActivator.cs*.
```CSharp
using System;
using Microsoft.Practices.Unity;
using Microsoft.Practices.Unity.Configuration;
using Microsoft.Practices.Unity.InterceptionExtension;
using Pilot.Util.Logging;
using Pilot.Util.Unity;
using Unity.SelfHostWebApiOwin;
using Pilot.Util.Unity.Lifetime;
using Pilot.Util.Transaction;
using System.Web.Mvc;
using Pilot.Util.Unity.Factory;

namespace PilotMvc.Config.Unity
{
    /// <summary>
    /// Specifies the Unity configuration for the main container.
    /// </summary>
    public class UnityConfig
    {
        #region Unity Container
        private static Lazy<IUnityContainer> container = new Lazy<IUnityContainer>(() =>
        {
            var container = new UnityContainer();
            RegisterTypes(container);

            //Set container for Controller Factory
            MvcUnityContainer.Container = container;

            //Set for Controller Factory
            ControllerBuilder.Current.SetControllerFactory(typeof(UnityControllerFactory));

            return container;
        });

        public static IUnityContainer GetConfiguredContainer()
        {
            return container.Value;
        }
        #endregion



        public static T Resolve<T>()
        {
            T obj = default(T);

            if (container.Value.IsRegistered(typeof(T)))
            {
                return container.Value.Resolve<T>();
            }

            return obj;
        }

        public static void RegisterTypes(IUnityContainer container)
        {
            container.AddNewExtension<Interception>();
            container
                    .RegisterTypes(UnityHelpers.GetTypesWithCustomAttribute<UnityIoCPerRequestLifetimeAttribute>(AppDomain.CurrentDomain.GetAssemblies()),
                                    WithMappings.FromMatchingInterface,
                                    WithName.Default,
                                    PerRequest,
                                    getInjectionMembers: t => new InjectionMember[]
                                    {
                                        new Interceptor<InterfaceInterceptor>(),
                                        new InterceptionBehavior<DiagnosisBehaviour>(),
                                        new InterceptionBehavior<TransactionBehaviour>()
                                    })
                    .RegisterTypes(UnityHelpers.GetTypesWithCustomAttribute<UnityIoCTransientLifetimeAttribute>(AppDomain.CurrentDomain.GetAssemblies()),
                                    WithMappings.FromMatchingInterface,
                                    WithName.Default,
                                    WithLifetime.Transient,
                                    getInjectionMembers: t => new InjectionMember[]
                                    {
                                        new Interceptor<InterfaceInterceptor>(),
                                        new InterceptionBehavior<DiagnosisBehaviour>(),
                                        new InterceptionBehavior<TransactionBehaviour>()
                                    }
                                )
                    // Same as singleton
                    .RegisterTypes(UnityHelpers.GetTypesWithCustomAttribute<UnityIoCContainerControlledLifetimeAttribute>(AppDomain.CurrentDomain.GetAssemblies()),
                                    WithMappings.FromMatchingInterface,
                                    WithName.Default,
                                    WithLifetime.ContainerControlled);
        }

        public static Func<System.Type, Microsoft.Practices.Unity.LifetimeManager> PerRequest = (x) => new PerRequestLifetimeManager();


        /***************************************************************************************************
         * 
         * Built in Lifetime Management
         * 
         * ContainerControlledLifetimeManager : singleton instance with dispose
         * HierarchicalLifetimeManager : singleton instance per container with dispose
         * TransientLifetimeManager : empty manager, always returns new object by resolve, no dispose!
         * PerRequestLifetimeManager (Unity.MVC) : singleton instance per http request with dispose
         * ExternallyControlledLifetimeManager : code must handle lifetime management
         * PerResolveLifetimeManager : like TransientLifetimeManager expect when in same object graph
         * PerThreadLifetimeManager : A LifetimeManager that holds the instances given to it, keeping one instance per thread.
         */

        /***************************************************************************************************
         * The application could use 3 different lifetime managers:
         * 
         * singleton
         * per request
         * always new
         * An attribute will be used to register all Types to be registered by convention. To do this, a new attribute has to be created.
         */
    }
}
```
```CSharp
using System.Linq;
using System.Web.Mvc;
using Microsoft.Practices.Unity.Mvc;

[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(PilotMvc.Config.Unity.UnityWebActivator), "Start")]
[assembly: WebActivatorEx.ApplicationShutdownMethod(typeof(PilotMvc.Config.Unity.UnityWebActivator), "Shutdown")]

namespace PilotMvc.Config.Unity
{
    /// <summary>Provides the bootstrapping for integrating Unity with ASP.NET MVC.</summary>
    public static class UnityWebActivator
    {
        /// <summary>Integrates Unity when the application starts.</summary>
        public static void Start() 
        {
            var container = UnityConfig.GetConfiguredContainer();

            FilterProviders.Providers.Remove(FilterProviders.Providers.OfType<FilterAttributeFilterProvider>().First());
            FilterProviders.Providers.Add(new UnityFilterAttributeFilterProvider(container));

            DependencyResolver.SetResolver(new UnityDependencyResolver(container));

            // TODO: Uncomment if you want to use PerRequestLifetimeManager
            // Microsoft.Web.Infrastructure.DynamicModuleHelper.DynamicModuleUtility.RegisterModule(typeof(UnityPerRequestHttpModule));
            Microsoft.Web.Infrastructure.DynamicModuleHelper.DynamicModuleUtility.RegisterModule(typeof(UnityPerRequestHttpModule));
        }

        /// <summary>Disposes the Unity container when the application is shut down.</summary>
        public static void Shutdown()
        {
            var container = UnityConfig.GetConfiguredContainer();
            container.Dispose();
        }
    }
}
```
```CSharp
using System.Web.Http;
using Microsoft.Practices.Unity.WebApi;

[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(PilotMvc.Config.Unity.UnityWebApiActivator), "Start")]
[assembly: WebActivatorEx.ApplicationShutdownMethod(typeof(PilotMvc.Config.Unity.UnityWebApiActivator), "Shutdown")]

namespace PilotMvc.Config.Unity
{
    /// <summary>Provides the bootstrapping for integrating Unity with WebApi when it is hosted in ASP.NET</summary>
    public static class UnityWebApiActivator
    {
        /// <summary>Integrates Unity when the application starts.</summary>
        public static void Start() 
        {
            // Use UnityHierarchicalDependencyResolver if you want to use a new child container for each IHttpController resolution.
            // var resolver = new UnityHierarchicalDependencyResolver(UnityConfig.GetConfiguredContainer());
            var resolver = new UnityDependencyResolver(UnityConfig.GetConfiguredContainer());

            GlobalConfiguration.Configuration.DependencyResolver = resolver;
        }

        /// <summary>Disposes the Unity container when the application is shut down.</summary>
        public static void Shutdown()
        {
            var container = UnityConfig.GetConfiguredContainer();
            container.Dispose();
        }
    }
}
```
Some classes, which are referenced here, are locate at Pilot.Util project. We have some attributes that make distinction between classes assigning an specific scope of life-cycle.
Other important class, it is UnityHelper that one provides a filtering based on the referenced attribute.

We should keep in mind that one of the most important parts it is the first initialization, I mean, we need to define a factory for our controllers. As you can see in the next block:
```Csharp
//Set container for Controller Factory
MvcUnityContainer.Container = container;

//Set for Controller Factory
ControllerBuilder.Current.SetControllerFactory(typeof(UnityControllerFactory));
```

### Javascript
Well, let's start coding in javascript. But not before we realize some concepts, ok?
Javascript it is really flexible and a powerful language. Sometimes, a set of aspects that can be commonly classified as unfavorable, could be also understood as good features. So, what do I mean? 
Javascript is weakly typed, also, it has not properly a definition for classes. We will see how it is possible implement classes with attributes and methods. But, basically, javascript is composed by primitive types as String, Number, undefined and null. In addition of complex types as function, object (instance of a function or json element), Array, Date.

#### First steps
