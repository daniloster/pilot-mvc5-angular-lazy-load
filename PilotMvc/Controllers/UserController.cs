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
using Pilot.Util.Data;

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

        /* List to interact with user */
        [Route("assigned-by-role"), HttpPost, HandleUIException("Something went wrong when tried to list some users!")]
        public ActionResult GetAssignedByRole(Role filter)
        {
            return new JsonResultView(UserService.GetAssignedUsersByRole(filter, AuthorizedUser, ApplicationSettings.Instance.LocalSystemId));
        }

        [Route("available-by-user"), HttpPost, HandleUIException("Something went wrong when tried to list some users!")]
        public ActionResult GetAvailableUsersByUser()
        {
            return new JsonResultView(UserService.GetAvailableUsers(AuthorizedUser, ApplicationSettings.Instance.LocalSystemId));
        }

        /* CRUD interaction methods */

        [Route("search"), HttpPost, HandleUIException("Something went wrong when tried to list some users!")]
        public ActionResult Search(User filter)
        {
            return new JsonResultView(UserService.GetByFilter(filter, AuthorizedUser, ApplicationSettings.Instance.LocalSystemId));
        }

        [Route("save"), HttpPost, HandleUIException("Something went wrong when tried to save the user!")]
        public ActionResult Save(User user)
        {
            UserService.Save(user);
            return new JsonResultView(new { Status = true, Message = "User has been saved successfully!" });
        }

        [Route("delete"), HttpPost, HandleUIException("Something went wrong when tried to delete the user!")]
        public ActionResult Delete(long id)
        {
            UserService.Delete(id);
            return new JsonResultView(new { Status = true, Message = "User has been deleted successfully!" });
        }
	}
}