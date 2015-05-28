using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Pilot.Util.Exceptions
{
    public class JsonException : System.Exception
    {
        public JsonResult exceptionDetails;

        public JsonException(string message, Exception inner) : base(message, inner) 
        {
            this.exceptionDetails = GetJson(message, inner == null ? string.Empty : inner.StackTrace);
        }

        public JsonException(System.Exception exception) : this(exception.Message, exception) { }

        public JsonException(string message) : this(message, null) { }

        protected JsonException(
        System.Runtime.Serialization.SerializationInfo info,
        System.Runtime.Serialization.StreamingContext context)
            : base(info, context) { }

        public static JsonResult GetJson(string message, string details)
        {
            return new JsonResult()
            {
                Data = new { Message = message, Details = details },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
    }
}
