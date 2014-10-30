using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Pilot.Util.Unity.Lifetime;
using Pilot.Entity;

namespace PilotMvc.Controllers
{
    public class IndexController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [System.Web.Mvc.ActionName("update-total-members")]
        [HttpPost]
        /// Parameters
        /// Use [FromUri] in case the request is a GET
        /// Use [FromBody] in case the request is a POST
        /// Method 
        /// Use [HttpGet] or [HttpPost] to determine type of request accepted
        public ActionResult Send(/*[FromUri]*/Member member)
        {
            return Json(new { FirstName = "Mock", LastName = member.LastName, Date = DateTime.Now, Floating = 9.9999999 }, JsonRequestBehavior.AllowGet);
        }
	}
}