using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace PilotMvc.Security.Config
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/bundles/app")
                .Include("~/Content/Styles/app.css"));
            

            bundles.Add(new StyleBundle("~/bundles/skeleton")
                .Include("~/Content/Styles/Skeleton/base.css")
                .Include("~/Content/Styles/Skeleton/layout.css")
                .Include("~/Content/Styles/Skeleton/skeleton.css"));

            bundles.Add(new StyleBundle("~/bundles/boilerplate")
                .Include("~/Content/Styles/Boilerplate/main.css")
                .Include("~/Content/Styles/Boilerplate/normalize.min.css")
                .Include("~/Content/Styles/Boilerplate/form.css"));

            bundles.Add(new StyleBundle("~/bundles/angular")
                .Include("~/Content/Scripts/Lib/AngularJS/angular-csp.css"));

            bundles.Add(new ScriptBundle("~/bundles/angular")
                .Include("~/Content/Scripts/Lib/AngularJS/angular.min.js")
                .Include("~/Content/Scripts/Lib/AngularJS/angular-sanitize.min.js")
                .Include("~/Content/Scripts/Lib/AngularJS/angular-route.min.js")
                .Include("~/Content/Scripts/Lib/AngularJS/angular-resource.min.js")
                .Include("~/Content/Scripts/Lib/AngularJS/angular-animate.min.js")
                .Include("~/Content/Scripts/Lib/AngularJS/angular-loader.min.js")
                .Include("~/Content/Scripts/Lib/AngularJS/angular-cookies.min.js")
                .Include("~/Content/Scripts/Lib/AngularJS/angular-mocks.js")
                .Include("~/Content/Scripts/Lib/AngularJS/angular-touch.min.js")
                /*.IncludeDirectory("~/Content/Scripts/Lib/AngularJS/i18n", "*.js", true)*/
                );

            bundles.Add(new ScriptBundle("~/bundles/jquery")
                .Include("~/Content/Scripts/Lib/JQuery/jquery-1.10.2.min.js")
                .Include("~/Content/Scripts/Lib/JQuery/jquery.validate.min.js")
                .Include("~/Content/Scripts/Lib/JQuery/jquery.validate.unobtrusive.min.js")
                .Include("~/Content/Scripts/Lib/JQuery/jquery-1.10.2.intellisense.js"));

            bundles.Add(new ScriptBundle("~/bundles/angular-jquery")
                .Include("~/Content/Scripts/Lib/JQuery/jquery-1.10.2.min.js")
                .Include("~/Content/Scripts/Lib/JQuery/jquery.validate.min.js")
                .Include("~/Content/Scripts/Lib/JQuery/jquery.validate.unobtrusive.min.js")
                .Include("~/Content/Scripts/Lib/AngularJS/angular.min.js")
                .Include("~/Content/Scripts/Lib/AngularJS/angular-sanitize.min.js")
                .Include("~/Content/Scripts/Lib/AngularJS/angular-route.min.js")
                .Include("~/Content/Scripts/Lib/AngularJS/angular-resource.min.js")
                .Include("~/Content/Scripts/Lib/AngularJS/angular-animate.min.js")
                .Include("~/Content/Scripts/Lib/AngularJS/angular-loader.min.js")
                .Include("~/Content/Scripts/Lib/AngularJS/angular-cookies.min.js")
                .Include("~/Content/Scripts/Lib/AngularJS/angular-mocks.js")
                .Include("~/Content/Scripts/Lib/AngularJS/angular-touch.min.js")
                .Include("~/Content/Scripts/Lib/JQuery/jquery-1.10.2.intellisense.js"));

            bundles.Add(new ScriptBundle("~/bundles/modernizr").IncludeDirectory(
                "~/Content/Scripts/Lib", "modernizr*", true));
        }
    }
}