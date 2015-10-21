using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Test.Config
{
    [AttributeUsage(AttributeTargets.Method, Inherited = false)]
    public class DatasetMappingAttribute : System.Attribute
    {
        public string SchemeXsd { get; set; }
        public string DataXml { get; set; }
        public string[] DataColletionXml { get; set; }
    }
}
