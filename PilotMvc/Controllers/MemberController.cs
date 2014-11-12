﻿using Microsoft.Practices.Unity;
using Pilot.Entity;
using Pilot.Service.Interfaces;
using Pilot.Util.Exceptions;
using Pilot.Util.Mvc;
using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace PilotMvc.Controllers
{

    [RoutePrefix("member")]
    public class MemberTestController : Controller
    {
        [Dependency]
        public IMemberService Service { get; set; }

        [Route("all")]
        public ActionResult Get()
        {
            return new JsonResultView(Service.Get(), JsonRequestBehavior.AllowGet);
        }

        [Route("get")]
        public ActionResult Get(int id)
        {
            return new JsonResultView(Service.Get(id), JsonRequestBehavior.AllowGet);
        }

        [Route("save")]
        public ActionResult Save(Member member)
        {

            Service.Save(member);
            return new JsonResultView(member, JsonRequestBehavior.AllowGet);
        }

        [Route("delete")]
        public ActionResult Delete(long id)
        {
            Service.Delete(id);
            return new JsonResultView(new { Status = "success", Message = "Member has been deleted!" }, JsonRequestBehavior.AllowGet);
        }

        protected override void Dispose(bool disposing)
        {
            Service.Dispose();
            base.Dispose(disposing);
        }

        #region Test methods

        [Route("send-test"), HttpPost, HandleUIException]
        public JsonResult Send(Member member)
        {
            try
            {
                var obj = new Member { FirstName = "Mock", LastName = member.LastName, Id = 20 };
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
        public JsonResult Send2(Member member)
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

        #endregion
    }
}