using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Pilot.Util.Exceptions
{
    public class HandleUIExceptionAttribute : FilterAttribute, IExceptionFilter
    {
        public string DefaultMessage { get; set; }

        public HandleUIExceptionAttribute() { }
        public HandleUIExceptionAttribute(string defaultMessage)
        {
            DefaultMessage = defaultMessage;
        }

        public virtual void OnException(ExceptionContext filterContext)
        {
            if (filterContext == null)
            {
                throw new ArgumentNullException("filterContext");
            }
            if (filterContext.Exception != null)
            {
                if (filterContext.Exception is ValidationException || filterContext.Exception is UserNotAutheticatedException)
                {
                    filterContext.Exception = new JsonException(filterContext.Exception);
                }
                else
                {
                    filterContext.Exception = new JsonException(DefaultMessage, filterContext.Exception);
                }
                if (filterContext.Exception is JsonException && ((JsonException)filterContext.Exception).exceptionDetails != null)
                {
                    filterContext.ExceptionHandled = true;
                    filterContext.HttpContext.Response.Clear();
                    filterContext.HttpContext.Response.TrySkipIisCustomErrors = true;
                    filterContext.HttpContext.Response.StatusCode = (int)System.Net.HttpStatusCode.InternalServerError;
                    filterContext.Result = ((JsonException)filterContext.Exception).exceptionDetails;
                }
            }
        }
    }
}
