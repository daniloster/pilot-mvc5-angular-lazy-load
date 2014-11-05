using Pilot.Util.Unity.Lifetime;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PilotMvc.Controllers
{
    public class PartialsController : Controller
    {
        //
        // GET: /Partials/
        public ActionResult Index()
        {
            return RedirectToAction("Home");
        }

        public ActionResult Home()
        {
            return View();
        }

        public ActionResult Member()
        {
            return View();
        }

        public ActionResult Contact()
        {
            return View();
        }
	}
}