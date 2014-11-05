using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Util.Security
{
    public class Encrypter
    {
        public static string Encrypt(string keyword, string value)
        {
            var data = System.Text.Encoding.ASCII.GetBytes(
                string.Format("{0}{1}",
                    keyword,
                    value));
            data = new HMACMD5(System.Text.Encoding.UTF8.GetBytes(keyword)).ComputeHash(data);
            return Convert.ToBase64String(data);
        }
    }
}
