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
using Pilot.Util.Files;

namespace PilotMvc.Controllers
{
    [RoutePrefix("contact")]
    public class ContactController : Controller
    {
        [Dependency]
        public IContactService Service { get; set; }

        [Route("create"), HttpPost, HandleUIException("Something wrong happens on contact creation")]
        public JsonResult Create(Contact contact, string fileName, int fileSize)
        {
            FileUtil.CopyFileStreamFromTempToFolderType(fileName, "ProfilePath");
            //contact.MemberId = contact.Member.Id;
            Service.Save(contact);
            return new JsonResultView(contact);
        }

        [Route("delete"), HttpPost, HandleUIException("It is not possible to delete the contact")]
        public JsonResult Delete(long Id)
        {
            Service.Delete(Id);
            return new JsonResultView(
                new { Message = "Contact has been removed successfully!" });
        }

        [Route("query"), HttpPost, HandleUIException("It is not possible to list the contacts")]
        public JsonResult Query()
        {
            var contacts = Service.GetWithMember();
            return new JsonResultView(contacts);
        }

        [Route("get-contact-types"), HttpPost, HandleUIException("It is not possible to list the contact types")]
        public JsonResult GetContactTypes()
        {
            var contactTypes = Service.GetContactTypes();
            return new JsonResultView(contactTypes);
        }
	}
}