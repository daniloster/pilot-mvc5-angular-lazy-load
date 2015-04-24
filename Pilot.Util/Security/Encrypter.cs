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
        public static string CreateRandomPassword(int PasswordLength)
        {
            string _allowedChars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789";
            Random randNum = new Random();
            char[] chars = new char[PasswordLength];
            int allowedCharCount = _allowedChars.Length;

            for (int i = 0; i < PasswordLength; i++)
            {
                chars[i] = _allowedChars[(int)((_allowedChars.Length) * randNum.NextDouble())];
            }

            return new string(chars);
        }

        public static string Encrypt(string keyword, string login, string password)
        {
            return GetMD5HashData(string.Format("{0}{1}{2}",
                    login,
                    keyword,
                    password));
        }

        public static string Encrypt(string keyword, string value)
        {
            return GetMD5HashData(string.Format("{0}{1}",
                    keyword,
                    value));
        }

        private static string GetMD5HashData(string data)
        {
            //create new instance of md5
            MD5 md5 = MD5.Create();

            //convert the input text to array of bytes
            byte[] hashData = md5.ComputeHash(Encoding.Default.GetBytes(data));

            //create new instance of StringBuilder to save hashed data
            StringBuilder returnValue = new StringBuilder();

            //loop for each byte and add it to StringBuilder
            for (int i = 0; i < hashData.Length; i++)
            {
                returnValue.Append(string.Format("{0:X}", hashData[i]));
            }

            // return hexadecimal string
            return returnValue.ToString();

        }
    }
}
