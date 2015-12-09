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
            EnableCors(config);
            RegisterHttpApiRoutes(config);
        }

        public static void EnableCors(HttpConfiguration config)
        {
            config.EnableCors();
        }

        public static void RegisterHttpApiRoutes(HttpConfiguration config)
        {
            config.MapHttpAttributeRoutes();
        }

        public static void RegisterWebRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{*allfiles}", new { allfiles = @".*\.(gif|jpg|png|ico|js|css)" });
            routes.IgnoreRoute("{*allangular}", new { allfiles = @".*/#/." });
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            AreaRegistration.RegisterAllAreas();

            routes.MapMvcAttributeRoutes();

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
