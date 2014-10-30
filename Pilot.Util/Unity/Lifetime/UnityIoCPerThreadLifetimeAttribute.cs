using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Util.Unity.Lifetime
{
    [System.AttributeUsage(System.AttributeTargets.Class | System.AttributeTargets.Struct | AttributeTargets.Interface)]
    public class UnityIoCPerThreadLifetimeAttribute : System.Attribute
    {
        public double version;

        public UnityIoCPerThreadLifetimeAttribute()
        {
            version = 1.0;
        }
    }
}
