using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Pilot.Util.Mvc
{
    public class JsonResultView : JsonResult
    {
        public JsonResultView(object data)
            : this(data, System.Web.Mvc.JsonRequestBehavior.DenyGet) { }

        public JsonResultView(object data, JsonRequestBehavior behavior)
            : base()
        {
            Data = data;
            JsonRequestBehavior = behavior;
        }

        public override void ExecuteResult(ControllerContext context)
        {
            HttpResponseBase response = context.HttpContext.Response;
            response.ContentType = "application/json";
            if (ContentEncoding != null)
                response.ContentEncoding = ContentEncoding;
            if (Data != null)
            {
                JsonTextWriter writer = new JsonTextWriter(response.Output) { Formatting = Formatting.Indented };
                JsonSerializer serializer = JsonSerializer.Create(new JsonSerializerSettings() {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                });
                serializer.Serialize(writer, Data);
                writer.Flush();
            }
        }
    }
}
