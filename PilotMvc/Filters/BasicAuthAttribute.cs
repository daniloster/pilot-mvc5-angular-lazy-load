﻿using Pilot.Entity;
using Pilot.Entity.Domain;
using Pilot.Service.Interfaces;
using Pilot.Util.Data;
using Pilot.Util.Mvc;
using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Filters;

namespace PilotMvc.Filters
{
    public class BasicAuthAttribute : ActionFilterAttribute, IAuthenticationFilter
    {
        [Dependency]
        public IUserService Service { get; set; }

        public void OnAuthentication(AuthenticationContext filterContext)
        {
        }

        public void OnAuthenticationChallenge(AuthenticationChallengeContext filterContext)
        {
            User user = filterContext.HttpContext.Session["CurrentUser"] as User;
            if (user == null)
            {
                filterContext.Result = new HttpUnauthorizedResult();
            }
            else
            {
                bool authorized = false;
                if (filterContext.HttpContext.Request.HttpMethod == "POST")
                {

                    authorized = Service.HasGrantedAccess(ApplicationSettings.Instance.LocalSystemId, user.Id, filterContext.HttpContext.Request.RawUrl);
                    if (!authorized)
                    {
                        filterContext.HttpContext.Response.Clear();
                        filterContext.HttpContext.Response.TrySkipIisCustomErrors = true;
                        filterContext.HttpContext.Response.StatusCode = (int)System.Net.HttpStatusCode.Unauthorized;
                        filterContext.Result = new JsonResultView(new { Message = ApplicationSettings.Instance.NotAuthorizedMessage });
                    }
                }

            }

        }
    }
}