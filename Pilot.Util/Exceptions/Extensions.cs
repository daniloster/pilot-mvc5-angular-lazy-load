using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Util.Exceptions
{
    public static class Extensions
    {
        public static void Assert<T>(this T model, string message, Func<T, bool> isValid)
        {
            if (!isValid(model))
            {
                throw new ValidationException(message);
            }
        }

        public static bool IsNullOrWhiteSpace(this String str)
        {
            return string.IsNullOrWhiteSpace(str);
        }
    }
}
