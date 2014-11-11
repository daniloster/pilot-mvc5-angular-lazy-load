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
    [RoutePrefix("")]
    [Route("{action=index}")]
    public class DefaultController : Controller
    {
        public ActionResult Index()
        {
            return View("~/Views/Index/Index.cshtml");
        }
	}
}