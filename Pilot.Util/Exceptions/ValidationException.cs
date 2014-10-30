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
        public string SourceError { get; private set; }

        public ValidationException(string sourceError) : this(string.Empty, null, sourceError) { }

        public ValidationException(string message, string sourceError) : this(message, null, sourceError) { }

        public ValidationException(System.Exception ex) : this(ex.Message, ex, null) { }

        public ValidationException(string message, System.Exception ex, string sourceError)
            : base(message, ex) 
        {
            SourceError = sourceError;
        }
    }
}
