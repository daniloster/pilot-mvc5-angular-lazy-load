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
    [DisableCors()]
    public class SystemController : BaseController
    {

        [Dependency]
        public ISystemService Service { get; set; }

        [Route("save"), HttpPost, HandleUIException]
        public ActionResult Save(WebSystem system)
        {
            system.Assert<WebSystem>("System has not been sent!", s => s != null);
            if (system.Id == 0)
            {
                Service.Create(system);
            }
            else
            {
                Service.Save(system);
            }
            return new JsonResultView(new { Status = "success", Message = "System has been saved successfully!" });
        }

        [Route("delete"), HttpPost, HandleUIException]
        public ActionResult Delete(long idSystem)
        {
            Service.Delete(idSystem);
            return new JsonResultView(new { Status = "success", Message = "System has been deleted successfully!" });
        }

        [Route("by-filter"), HttpPost, HandleUIException("We could not get the systems for you. Sorry, try it later!")]
        public ActionResult GetByFilter(WebSystem system)
        {
            return new JsonResultView(Service.GetByFilter(system));
        }
	}
}