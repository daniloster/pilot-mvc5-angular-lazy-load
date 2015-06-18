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
using Pilot.Util.Data;

namespace PilotMvc.Controllers
{
    [RoutePrefix("role")]
    public class RoleController : BaseController
    {
        [Dependency]
        public IRoleService RoleService { get; set; }

        [Route("search"), HttpPost, HandleUIException("Something went wrong when tried to list some roles!")]
        public ActionResult Search(Role filter)
        {
            return new JsonResultView(RoleService.GetByFilter(filter, AuthorizedUser, ApplicationSettings.Instance.LocalSystemId));
        }

        [Route("available-by-user"), HttpPost, HandleUIException("Something went wrong when tried to list some roles!")]
        public ActionResult GetAvailableRolesByUser()
        {
            return new JsonResultView(RoleService.GetAvailableRoles(AuthorizedUser, ApplicationSettings.Instance.LocalSystemId));
        }

        [Route("save"), HttpPost, HandleUIException("Something went wrong when tried to save the role!")]
        public ActionResult Save(Role role)
        {
            RoleService.Save(role);
            return new JsonResultView(new { Status = true, Message = "Role has been saved successfully!" });
        }

        [Route("delete"), HttpPost, HandleUIException("Something went wrong when tried to delete the role!")]
        public ActionResult Delete(long id)
        {
            RoleService.Delete(id);
            return new JsonResultView(new { Status = true, Message = "Role has been role successfully!" });
        }
	}
}