using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Pilot.Util.Unity.Lifetime;
using Pilot.Entity;
using Pilot.Util.Exceptions;
using Pilot.Util.Mvc;
using System.Web.Security;
using System.Web.Script.Serialization;
using System.Reflection;
using Newtonsoft.Json;
using System.IO;

namespace PilotMvc.Controllers
{
    public class BaseController : Controller
    {
        private const string SplitterText = "|#@^@#|";
        protected static volatile object sync = new object();
        /// <summary>
        /// Convert a relative path into a real path. Must be used to save files on disk.
        /// </summary>
        /// <param name="relativePath">Relative path from project base.</param>
        /// <returns>[string] Real path</returns>
        public static string GetPath(string relativePath)
        {
            return System.Web.HttpContext.Current.Server.MapPath(relativePath);
        }

        public Pilot.Entity.User AuthorizedUser
        {
            get
            {
                Pilot.Entity.User user = null;
                HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];

                if (System.Web.HttpContext.Current.Session["_AuthorizedUser"] != null)
                {
                    user = System.Web.HttpContext.Current.Session["_AuthorizedUser"] as Pilot.Entity.User;
                }
                else if (authCookie != null)
                {
                    FormsAuthenticationTicket authTicket = FormsAuthentication.Decrypt(authCookie.Value);

                    string[] userRoles = authTicket.UserData.Split(new string[] { SplitterText }, StringSplitOptions.None);

                    if (userRoles.Length > 1)
                    {
                        JavaScriptSerializer serializer =  new JavaScriptSerializer();
                        user = serializer.Deserialize<Pilot.Entity.User>(userRoles[0]);
                        user.AuthorizedSystemId = serializer.Deserialize<long>(userRoles[1]);
                        user.Roles = serializer.Deserialize<List<Pilot.Entity.Role>>(userRoles[2]);

                        System.Web.HttpContext.Current.Session["_AuthorizedUser"] = user;
                    }
                }
                else
                {
                    throw new UserNotAutheticatedException("There is no user logged in!");
                }

                return user;
            }
        }

        public void UpdateUserSession(Pilot.Entity.User user, bool? rememberMe)
        {
            if (user == null)
            {
                ClearAuthCookieAndSession();
            }
            else
            {
                SetAuthCookieAndSession(user, rememberMe);
            }
        }

        private void ClearAuthCookieAndSession()
        {
            lock (sync)
            {
                try
                {
                    Session.Clear();
                    Session.Abandon();
                }
                catch (Exception)
                {
                }

                HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];

                if (authCookie != null)
                {
                    authCookie.Expires = DateTime.Now.AddDays(-1d);
                    authCookie.Value = "";
                    Response.Cookies.Clear();
                    Response.Cookies.Add(authCookie);

                    FormsAuthentication.SignOut();
                    FormsAuthentication.RedirectToLoginPage();
                }
            }
        }

        private void SetAuthCookieAndSession(Pilot.Entity.User userLoggedIn, bool? rememberMe)
        {
            System.Web.HttpContext.Current.Session["_AuthorizedUser"] = userLoggedIn;

            HttpCookie userCookie;

            System.Text.StringBuilder stringBuilder = new System.Text.StringBuilder();
            //StringWriter stringWriter = new StringWriter(stringBuilder);
            //JsonTextWriter writer = new JsonTextWriter(stringWriter) { Formatting = Formatting.Indented };
            //JsonSerializer serializer = JsonSerializer.Create(new JsonSerializerSettings()
            //{
            //    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            //});
            //serializer.Serialize(writer, userLoggedIn);
            //writer.Flush();
            
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            stringBuilder.Append(serializer.Serialize(userLoggedIn))
                .Append(SplitterText)
                .Append(serializer.Serialize(userLoggedIn.AuthorizedSystemId))
                .Append(SplitterText)
                .Append(serializer.Serialize(userLoggedIn.Roles));

            FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(1,
              userLoggedIn.GetType().GetProperty("Email").GetValue(userLoggedIn).ToString(),
              DateTime.Now,
              DateTime.MaxValue,
              (rememberMe.HasValue ? rememberMe.Value : false),
              //new JavaScriptSerializer().Serialize(userLoggedIn),
              stringBuilder.ToString(),
              FormsAuthentication.FormsCookiePath);

            userCookie = new HttpCookie(FormsAuthentication.FormsCookieName, FormsAuthentication.Encrypt(ticket));

            if (rememberMe.HasValue)
            {
                userCookie.Expires = ticket.Expiration;
            }
            userCookie.Path = FormsAuthentication.FormsCookiePath;

            if (Response != null)
                Response.Cookies.Add(userCookie);
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
            var props = this.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.DeclaredOnly | BindingFlags.FlattenHierarchy);
            IDisposable disposable;
            foreach (var prop in props)
            {
                disposable = (prop.GetValue(this) as IDisposable);
                if (disposable != null)
                {
                    disposable.Dispose();
                }
            }
        }
	}
}