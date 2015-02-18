using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Pilot.Util.Unity.Lifetime;
using Pilot.Entity;
using Pilot.Util.Exceptions;
using Pilot.Util.Mvc;
using Pilot.Service.Interfaces;
using Microsoft.Practices.Unity;
using Pilot.Util.Security;
using Pilot.Util.Data;
using System.IO;
using Pilot.Util.Logging;
using System.Drawing;

namespace PilotMvc.Controllers
{
    [RoutePrefix("upload")]
    public class UploadController : Controller
    {
        public const string PrivateKeyWord = "Upl04dCr4zyyyynesSS";

        [Route("imagePng"), HttpPost, HandleUIException]
        public JsonResult ImagePng(string imageName, string imageValue, string folderType)
        {
            try
            {
                string fileName = UploadController.GetFileName(imageName, imageValue.Length, true);
                var appSettings = ApplicationSettings.Instance;

                string partialPath = appSettings.GetType().GetProperty(folderType).GetValue(appSettings) as string;
                string savingPath = Path.Combine(new string[] { AppDomain.CurrentDomain.BaseDirectory, partialPath.IndexOf("/") == 0 || partialPath.IndexOf("\\") == 0 ? partialPath.Substring(1) : partialPath });
                string displayFolder = string.Join("", new string[] { partialPath, "temp\\" });

                if (!Directory.Exists(savingPath))
                {
                    Directory.CreateDirectory(savingPath);
                }

                string finalPath = string.Format("{0}{1}", savingPath, fileName);

                //get a temp image from bytes, instead of loading from disk
                byte[] bytes = Convert.FromBase64String(imageValue.Replace("data:image/png;base64,", string.Empty));

                Image image;
                using (MemoryStream ms = new MemoryStream(bytes))
                {
                    image = Image.FromStream(ms);
                }
                image.Save(finalPath);

                LoggerFile.AppendLogSafe(string.Format("@ FILE UPLOAD: {0} ==> SIZE: {1} ==> FILE TOKEN: {2}", imageName, imageValue.Length, fileName));

                return new JsonResultView(
                    new
                    {
                        FileName = fileName,
                        Size = imageValue.Length,
                        ImagePreview = displayFolder + "\\" + fileName
                    }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                throw new JsonException(e);
            }
        }

        [Route("file"), HttpPost, HandleUIException]
        public JsonResult File()
        {
            try
            {
                HttpPostedFileWrapper file = (HttpPostedFileWrapper)HttpContext.Request.Files[0];
                string folderType = HttpContext.Request["folderType"] as string;
                string fileName = UploadController.GetFileName(file.FileName, file.ContentLength);
                var appSettings = ApplicationSettings.Instance;

                string partialPath = appSettings.GetType().GetProperty(folderType).GetValue(appSettings) as string;
                string savingPath = Path.Combine(new string[] { AppDomain.CurrentDomain.BaseDirectory, partialPath.IndexOf("/") == 0 || partialPath.IndexOf("\\") == 0 ? partialPath.Substring(1) : partialPath });
                string displayFolder = string.Join("", new string[] { partialPath, "temp\\" });

                if (!Directory.Exists(savingPath))
                {
                    Directory.CreateDirectory(savingPath);
                }

                file.SaveAs(string.Format("{0}{1}", savingPath, fileName));

                LoggerFile.AppendLogSafe(string.Format("@ FILE UPLOAD: {0} ==> SIZE: {1} ==> FILE TOKEN: {2}", file.FileName, file.ContentLength, fileName));

                return new JsonResultView(
                    new
                    {
                        FileName = fileName,
                        Size = file.ContentLength,
                        FilePreview = (displayFolder) + "\\" + fileName
                    }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                throw new JsonException(e);
            }
        }

        public static string GetFileName(string fileName, int size, bool forcePng = false)
        {
            string _fileName = Encrypter.Encrypt(
                    string.Format("{0}", PrivateKeyWord)
                    , fileName).Replace("=", string.Empty).Replace("+", string.Empty).Replace("\\", string.Empty).Replace("/", string.Empty);
            _fileName = string.Format("{0}{1}", _fileName, forcePng ? ".png" : fileName.Substring(fileName.LastIndexOf(".")));
            return _fileName;
        }

        public static FileStream GetFileStream(string fileName, int size, string folder)
        {
            string realFileName = UploadController.GetFileName(fileName, size);
            return System.IO.File.Open(
                string.Format("{0}{1}",
                    folder,
                    realFileName),
                System.IO.FileMode.Open);
        }

        public static void CopyFileStreamTo(string fileName, int size, string folderTo, string folderFrom)
        {
            string realName = GetFileName(fileName, size);

            if (!Directory.Exists(folderTo))
            {
                Directory.CreateDirectory(folderTo);
            }

            System.IO.File.Copy(
                string.Format("{0}{1}", folderFrom, realName),
                string.Format("{0}{1}", folderTo, fileName),
                true);
        }
	}
}