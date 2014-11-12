using Pilot.Util.Unity.Lifetime;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PilotMvc.Controllers
{
    [RoutePrefix("partials")]
    [Route("{action=index}")]
    public class PartialsController : Controller
    {
        //
        // GET: /Partials/
        [Route]
        public ActionResult Index()
        {
            return RedirectToAction("home");
        }

        [Route("home")]
        public ActionResult Home()
        {
            return View();
        }

        ///if you dont assing any route name for your controller method,
        /// yourit'll be the action name. Besides it is not a case sensitive
        [Route("member")] 
        public ActionResult Member()
        {
            return View();
        }

        [Route("contact")]
        public ActionResult Contact()
        {
            return View();
        }

        [Route("404")]
        public ActionResult PageNotFound()
        {
            return View();
        }

        [Route("not-authorized")]
        public ActionResult NotAuthorized()
        {
            return View();
        }

        [Route("login")]
        public ActionResult Login()
        {
            return View();
        }
	}
}