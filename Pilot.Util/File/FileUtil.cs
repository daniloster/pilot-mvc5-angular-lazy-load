using Pilot.Util.Data;
using Pilot.Util.Security;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Util.File
{
    public class FileUtil
    {



        public static string GetPartialDirectory(string folderType)
        {
            return ApplicationSettings.Instance.GetType().GetProperty(folderType).GetValue(ApplicationSettings.Instance) as string;
        }

        public static string GetFullDirectoryFromRelative(string relativePath)
        {
            return Path.Combine(new string[] { AppDomain.CurrentDomain.BaseDirectory, relativePath.IndexOf("/") == 0 || relativePath.IndexOf("\\") == 0 ? relativePath.Substring(1) : relativePath });
        }

        public static string GetTempOne(string path)
        {
            return string.Join("", new string[] { path, "temp\\" });
        }

        public static string GetFileName(string fileName, int size, bool forcePng = false)
        {
            string _fileName = Encrypter.Encrypt(
                    string.Format("{0}", ApplicationSettings.Instance.PrivateKeyWordEncrypter)
                    , fileName).Replace("=", string.Empty).Replace("+", string.Empty).Replace("\\", string.Empty).Replace("/", string.Empty);
            _fileName = string.Format("{0}{1}", _fileName, forcePng ? ".png" : fileName.Substring(fileName.LastIndexOf(".")));
            return _fileName;
        }

        public static FileStream GetFileStream(string fileName, int size, string folder)
        {
            string realFileName = FileUtil.GetFileName(fileName, size);
            return System.IO.File.Open(
                string.Format("{0}{1}",
                    folder,
                    realFileName),
                System.IO.FileMode.Open);
        }

        public static void CopyFileStreamFromTempToFolderType(string fileName, string folderType)
        {
            string partialPath = FileUtil.GetPartialDirectory(folderType);
            string savingPath = FileUtil.GetFullDirectoryFromRelative(partialPath);
            string tempFolder = FileUtil.GetTempOne(partialPath);

            CopyFileStreamTo(fileName, savingPath, tempFolder);
        }

        public static void CopyFileStreamTo(string fileName, string folderTo, string folderFrom)
        {
            if (!Directory.Exists(folderTo))
            {
                Directory.CreateDirectory(folderTo);
            }

            System.IO.File.Copy(
                string.Format("{0}{1}", folderFrom, fileName),
                string.Format("{0}{1}", folderTo, fileName),
                true);
        }

    }
}
