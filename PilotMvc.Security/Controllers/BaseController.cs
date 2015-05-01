using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Pilot.Util.Unity.Lifetime;
using Pilot.Entity;
using Pilot.Util.Exceptions;
using Pilot.Util.Mvc;
using Pilot.Entity.Security;
using System.Web.Security;
using System.Web.Script.Serialization;
using System.Web.Http.Cors;

namespace PilotMvc.Security.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class BaseController : Controller
    {
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

        public User AuthorizedUser
        {
            get
            {
                User user = null;
                HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];

                if (System.Web.HttpContext.Current.Session["_AuthorizedUser"] != null)
                {
                    user = System.Web.HttpContext.Current.Session["_AuthorizedUser"] as User;
                }
                else if (authCookie != null)
                {
                    FormsAuthenticationTicket authTicket = FormsAuthentication.Decrypt(authCookie.Value);

                    user = new JavaScriptSerializer().Deserialize<User>(authTicket.UserData);
                }
                else
                {
                    throw new UserNotAutheticatedException("There is no user logged in!");
                }

                return user;
            }
        }

        public void UpdateUserSession(User user, bool? rememberMe)
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

        private void SetAuthCookieAndSession(User userLoggedIn, bool? rememberMe)
        {
            System.Web.HttpContext.Current.Session["_AuthorizedUser"] = userLoggedIn;

            HttpCookie userCookie;

            FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(1,
              userLoggedIn.Email,
              DateTime.Now,
              DateTime.MaxValue,
              (rememberMe.HasValue ? rememberMe.Value : false),
              new JavaScriptSerializer().Serialize(userLoggedIn),
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
	}
}