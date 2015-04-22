using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Util.Exceptions
{
    public class ValidationException : BaseException
    {
        public ValidationException(string message) : this(message, null) { }

        public ValidationException(System.Exception ex) : this(ex.Message, ex) { }

        public ValidationException(string message, System.Exception ex)
            : base(message, ex) 
        { }
    }
}
