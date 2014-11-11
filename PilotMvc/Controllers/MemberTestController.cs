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
    [RoutePrefix("member-test")]
    public class MemberTestController : Controller
    {
        [Route("send-test"), HttpPost, HandleUIException]
        /// Parameters
        /// Use [FromUri] in case the request is a GET
        /// Use [FromBody] in case the request is a POST
        /// Method 
        /// Use [HttpGet] or [HttpPost] to determine type of request accepted
        public JsonResult Send(/*[FromUri]*/Member member)
        {
            try
            {
                var obj = new Member{ FirstName = "Mock", LastName = member.LastName, Id = 20 };
                var list = new List<Member>();
                for (int i = 0; i < 230; i++)
                {
                    list.Add(obj);
                }
                return Json(list, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e) 
            {
                throw new JsonException(e);
            }
        }

        [Route("send-test2"), HttpPost, HandleUIException]
        /// Parameters
        /// Use [FromUri] in case the request is a GET
        /// Use [FromBody] in case the request is a POST
        /// Method 
        /// Use [HttpGet] or [HttpPost] to determine type of request accepted
        public JsonResult Send2(/*[FromUri]*/Member member)
        {
            try
            {
                return new JsonResultView(new { FirstName = "Mock", LastName = member.LastName, Birthday = DateTime.Now }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e) 
            {
                throw new JsonException(e);
            }
        }
	}
}