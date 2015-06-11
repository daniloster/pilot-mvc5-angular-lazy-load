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
using Pilot.Entity.Domain;

namespace PilotMvc.Controllers
{
    [RoutePrefix("resource")]
    public class ResourceController : BaseController
    {
        [Dependency]
        public IResourceService ResourceService { get; set; }    

        [Route("search"), HttpPost, HandleUIException("Something went wrong when tried to list some resources!")]
        public ActionResult Search(Resource resourceFilter)
        {
            return new JsonResultView(ResourceService.GetByFilter(resourceFilter));
        }

        [Route("types"), HttpPost, HandleUIException("Something went wrong when tried to list some resources!")]
        public ActionResult GetTypes()
        {
            return new JsonResultView(ResourceType.List);
        }

        [Route("save"), HttpPost, HandleUIException("Something went wrong when tried to save the resource!")]
        public ActionResult Save(Resource resource)
        {
            ResourceService.Save(resource);
            return new JsonResultView(new { Status = true, Message = "The resource has been saved successfully!" });
        }

        [Route("delete"), HttpPost, HandleUIException("Something went wrong when tried to delete the resource!")]
        public ActionResult Delete(long id)
        {
            ResourceService.Delete(id);
            return new JsonResultView(new { Status = true, Message = "Resource has been deleted successfully!" });
        }
	}
}