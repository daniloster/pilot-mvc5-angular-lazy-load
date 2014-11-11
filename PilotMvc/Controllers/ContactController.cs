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
using Pilot.Util.Data;

namespace PilotMvc.Controllers
{
    [RoutePrefix("contact")]
    public class ContactController : Controller
    {
        [Dependency]
        public IContactService Service { get; set; }

        [Route("create"), HttpPost, HandleUIException]
        public JsonResult Create(Contact contact, string fileName, int fileSize)
        {
            try
            {
                System.IO.FileStream fs = UploadController.GetFileStream(fileName, fileSize);
                contact.MemberId = contact.Member.Id;
                Service.Save(contact);
                return new JsonResultView(contact, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e) 
            {
                throw new JsonException(e);
            }
        }

        [Route("delete"), HttpPost, HandleUIException]
        public JsonResult Delete(long Id)
        {
            try
            {
                Service.Delete(Id);
                return new JsonResultView(
                    new { Message = "Contact has been removed successfully!" }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e) 
            {
                throw new JsonException(e);
            }
        }

        [Route("query"), HttpPost, HandleUIException]
        public JsonResult Query()
        {
            try
            {
                var contacts = Service.GetWithMember();
                return new JsonResultView(contacts, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e) 
            {
                throw new JsonException(e);
            }
        }

        [Route("get-contact-types"), HttpPost, HandleUIException]
        public JsonResult GetContactTypes()
        {
            try
            {
                var contactTypes = Service.GetContactTypes();
                return new JsonResultView(contactTypes, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                throw new JsonException(e);
            }
        }
	}
}