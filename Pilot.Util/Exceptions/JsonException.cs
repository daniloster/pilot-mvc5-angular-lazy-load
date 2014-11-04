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

        public JsonException(JsonResult exceptionDetails)
        {
            this.exceptionDetails = exceptionDetails;
        }

        public JsonException(string message) : base(message) { }
        public JsonException(string message, Exception inner) : base(message, inner) { }

        public JsonException(System.Exception exception) : this(GetJson(exception)) { }

        protected JsonException(
        System.Runtime.Serialization.SerializationInfo info,
        System.Runtime.Serialization.StreamingContext context)
            : base(info, context) { }

        public static JsonResult GetJson(Exception e)
        {
            return GetJson(e.Message);
        }

        public static JsonResult GetJson(string message)
        {
            return new JsonResult()
            {
                Data = new { Message = message },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
    }
}
