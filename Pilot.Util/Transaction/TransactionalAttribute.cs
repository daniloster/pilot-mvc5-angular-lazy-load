using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Util.Transaction
{
    [System.AttributeUsage(System.AttributeTargets.Method | AttributeTargets.Interface | AttributeTargets.Class)]
    public class TransactionalAttribute : System.Attribute
    {
    }
}
