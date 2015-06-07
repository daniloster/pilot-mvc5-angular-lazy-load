using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Pilot.Util.Unity.Lifetime;
using Pilot.Entity;
using Pilot.Util.Exceptions;
using Pilot.Util.Mvc;
using Pilot.Service.Interfaces;
using Microsoft.Practices.Unity;

namespace PilotMvc.Controllers
{
    [RoutePrefix("user")]
    public class UserController : BaseController
    {
        [Dependency]
        public IUserService UserService { get; set; }

        [Route("logout"), HttpPost, HandleUIException("Something went wrong when tried to logout!")]
        public ActionResult Logout()
        {
            UpdateUserSession(null, false);

            return new JsonResultView(new { Status = true, Message = "You have been logged out successfully!" });
        }

        [Route("login"), HttpPost, HandleUIException("Something went wrong when tried to login!")]
        public ActionResult Login(string userName, string password, bool rememberMe)
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
                    ViewResources = new object[] { new { Value = "/" }, new { Value = "/application" } }
                };
            }
            else 
            {
                throw new ValidationException("There is no user with this user name!");
            }

            UpdateUserSession(user, rememberMe);

            return new JsonResultView(user);
        }

        [Route("current"), HttpPost, HandleUIException("Something went wrong when tried to refresh the user data!")]
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