using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Util.Exceptions
{
    public class BaseException : System.Exception
    {
        public BaseException(string message) : this(message, null) { }

        public BaseException(System.Exception ex) : this(ex.Message, ex) { }

        public BaseException(string message, System.Exception ex) : base(message, ex) { }
    }
}
