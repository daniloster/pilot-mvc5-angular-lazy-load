using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Util.Unity.Lifetime
{
    [System.AttributeUsage(System.AttributeTargets.Class | System.AttributeTargets.Struct | AttributeTargets.Interface)]
    public class UnityIoCTransientLifetimeAttribute : System.Attribute
    {
        public double version;

        public UnityIoCTransientLifetimeAttribute()
        {
            version = 1.0;
        }
    }
}
