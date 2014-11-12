using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace PilotMvc.Config
{
    public class RouteConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.MapHttpAttributeRoutes();
        }

        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            AreaRegistration.RegisterAllAreas();

            routes.MapMvcAttributeRoutes();
            
            // Code below removed and replaced by attributes mapping

            //routes.MapRoute(
            //    name: "Index",
            //    url: string.Empty,
            //    defaults: new { controller = "Index", action = "Index" }
            //);

            //routes.MapRoute(
            //    name: "Partials",
            //    url: "Partials/{action}.html",
            //    defaults: new { controller = "Partials" }
            //);

            //routes.MapHttpRoute(
            //    name: "DefaultApi",
            //    routeTemplate: "api/{controller}/{id}",
            //    defaults: new { id = RouteParameter.Optional }
            //);

            //routes.MapRoute(
            //    name: "DefaultController",
            //    url: "{controller}/{action}"
            //);

            //routes.MapRoute(
            //    name: "DefaultAnswer",
            //    url: "{controller}/{action}",
            //    defaults: new { controller = "Index", action = "index" }
            //);

            routes.MapRoute(
                name: "Index",
                url: string.Empty,
                defaults: new { controller = "Default", action = "Index" }
            );

            routes.MapRoute(
                "NotFound",
                "{*url}",
                new { controller = "Default", action = "Index" }
            );
        }
    }
}
