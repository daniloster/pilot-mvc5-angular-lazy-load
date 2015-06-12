using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Pilot.Util.Unity.Lifetime;
using Pilot.Entity;
using Pilot.Service.Interfaces;
using Pilot.Util.Exceptions;
using Pilot.Util.Mvc;
using Microsoft.Practices.Unity;
using Pilot.Util.Data;

namespace PilotMvc.Controllers
{
    [RoutePrefix("application")]
    public class ApplicationController : BaseController
    {
        [Dependency]
        public IApplicationService ApplicationService { get; set; }    

        [Route("search"), HttpPost, HandleUIException("Something went wrong when tried to list some applications!")]
        public ActionResult Search(Application filter)
        {
            return new JsonResultView(ApplicationService.GetByFilter(filter, AuthorizedUser, ApplicationSettings.Instance.LocalSystemId));
        }

        [Route("available-by-user"), HttpPost, HandleUIException("Something went wrong when tried to list some applications!")]
        public ActionResult GetAvailableAppsByUser()
        {
            return new JsonResultView(ApplicationService.GetAvailableAppsByUser(AuthorizedUser, ApplicationSettings.Instance.LocalSystemId));
        }

        [Route("save"), HttpPost, HandleUIException("Something went wrong when tried to save the application!")]
        public ActionResult Save(Application application)
        {
            ApplicationService.Save(application);
            return new JsonResultView(new { Status = true, Message = "The application has been saved successfully!" });
        }

        [Route("delete"), HttpPost, HandleUIException("Something went wrong when tried to delete the application!")]
        public ActionResult Delete(long id)
        {
            ApplicationService.Delete(id);
            return new JsonResultView(new { Status = true, Message = "Application has been deleted successfully!" });
        }
	}
}