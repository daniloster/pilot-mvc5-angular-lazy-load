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
using System.Web.Http.Cors;

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
            UpdateUserSession(UserService.Authorize(1, userName, password), rememberMe);
            return new JsonResultView(AuthorizedUser);
        }


        [Route("authorize"), HttpPost, HandleUIException("Something went wrong when tried to authorize!")]
        [EnableCors("*", "*", "*")]
        public ActionResult Authorize(long idApplication, string userName, string password, bool rememberMe)
        {
            UpdateUserSession(UserService.Authorize(idApplication, userName, password), rememberMe);
            return new JsonResultView(AuthorizedUser);
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