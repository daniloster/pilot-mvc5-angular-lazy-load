using Microsoft.VisualStudio.TestTools.UnitTesting;
using Pilot.Util.Transaction;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Pilot.Test.Config
{
    public class PerRequestLifetimeManager : Microsoft.Practices.Unity.PerRequestLifetimeManager
    {
        static PerRequestLifetimeManager() { }

        public PerRequestLifetimeManager(TestContext testContext) : base()
        {
            var request = new HttpRequest("fake", "https://127.0.0.1", null);
            var respons = new HttpResponse(new StringWriter());
            var context = new HttpContext(request, respons);
            HttpContext.Current = context;
        }
    }
}
