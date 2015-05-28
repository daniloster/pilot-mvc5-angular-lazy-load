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
    public class UserController : BaseController
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
                    Id = 1,
                    Name = "Danilo Castro",
                    Email = "danilo@mail.com",
                    ViewResources = new object[] { new { Value = "/" }, new { Value = "/member" }, new { Value = "/contact" } }
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
                    Id = 2,
                    Name = "Leticia Calmon",
                    Email = "leti@mail.com",
                    ViewResources = new object[] { new { Value = "/" }, new { Value = "/member" } }
                };
            }
            else 
            {
                throw new ValidationException("There is no user with this user name!");
            }

            UpdateUserSession(user, false);

            return new JsonResultView(user);
        }

        [Route("current"), HttpPost, HandleUIException]
        public ActionResult Get()
        {
            if (AuthorizedUser == null) 
            {
                throw new ValidationException("There is no user logged in!");
            }

            return new JsonResultView(AuthorizedUser);
        }
	}
}