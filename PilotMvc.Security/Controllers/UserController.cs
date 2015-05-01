using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Pilot.Util.Unity.Lifetime;
using Pilot.Entity.Security;
using Pilot.Util.Exceptions;
using Pilot.Util.Mvc;
using Microsoft.Practices.Unity;
using Pilot.Service.Security.Interfaces;
using Pilot.Util.Data;
using System.Web.Http.Cors;

namespace PilotMvc.Security.Controllers
{
    [RoutePrefix("user")]
    public class UserController : BaseController
    {

        [Dependency]
        public IUserService Service { get; set; }

        [Route("authorize"), HttpPost, HandleUIException]
        public ActionResult Authorize(long idSystem, string userName, string password)
        {
            User user = Service.Authorize(idSystem, userName, password);
            return new JsonResultView(user);
        }

        [Route("login"), HttpPost, HandleUIException]
        [DisableCors()]
        public ActionResult Authorize(string userName, string password)
        {
            User user = Service.Authorize(ApplicationSettings.Instance.LocalSystemId, userName, password);
            if (user != null)
            {
                user.AuthorizedSystemId = ApplicationSettings.Instance.LocalSystemId;
            }
            return new JsonResultView(user);
        }

        [Route("current"), HttpPost, HandleUIException]
        public ActionResult Get()
        {
            object user = HttpContext.Session["CurrentUser"];

            if (user == null) 
            {
                throw new ValidationException("There is no user logged in!");
            }

            return new JsonResultView(user);
        }
	}
}