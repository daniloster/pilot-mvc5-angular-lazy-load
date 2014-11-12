using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Pilot.Util.Unity.Lifetime;
using Pilot.Entity;
using Pilot.Util.Exceptions;
using Pilot.Util.Mvc;

namespace PilotMvc.Controllers
{
    [RoutePrefix("user")]
    public class UserController : Controller
    {
        [Route("login"), HttpPost, HandleUIException]
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

        [Route("current"), HttpPost, HandleUIException]
        public ActionResult Get()
        {
            object user = HttpContext.Session["CurrentUser"];

            if (user == null) 
            {
                throw new ValidationException("There is no user logged in!");
            }

            return new JsonResultView(user, JsonRequestBehavior.AllowGet);
        }
	}
}