using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Util.Exceptions
{
    public class UserNotAutheticatedException : BaseException
    {
        public UserNotAutheticatedException(string message) : this(message, null) { }

        public UserNotAutheticatedException(System.Exception ex) : this(ex.Message, ex) { }

        public UserNotAutheticatedException(string message, System.Exception ex)
            : base(message, ex) 
        { }
    }
}
