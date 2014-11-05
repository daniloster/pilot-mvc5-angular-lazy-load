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

namespace PilotMvc.Controllers
{
    public class UploadController : Controller
    {
        public const string PrivateKeyWord = "Upl04dCr4zyyyynesSS";

        [ActionName("file"), HttpPost, HandleUIException]
        public JsonResult Create()
        {
            try
            {
                HttpPostedFileWrapper file = (HttpPostedFileWrapper)HttpContext.Request.Files[0];
                string fileName = UploadController.GetFileName(file.FileName, file.ContentLength);
                
                if (!Directory.Exists(ApplicationSettings.Instance.UploadTmpDirectory))
                {
                    Directory.CreateDirectory(ApplicationSettings.Instance.UploadTmpDirectory);
                }

                file.SaveAs(string.Format("{0}{1}", ApplicationSettings.Instance.UploadTmpDirectory, fileName));

                LoggerFile.AppendLogSafe(string.Format("@ FILE UPLOAD: {0} ==> SIZE: {1} ==> FILE TOKEN: {2}", file.FileName, file.ContentLength, fileName));

                return new JsonResultView(
                    new { 
                        FileName = file.FileName, 
                        Size = file.ContentLength
                    }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e) 
            {
                throw new JsonException(e);
            }
        }

        public static string GetFileName(string fileName, int size)
        {
            string _fileName = Encrypter.Encrypt(
                    string.Format("{0}{1}{2}", System.Web.HttpContext.Current.Session.SessionID, PrivateKeyWord, size)
                    , fileName).Replace("=", string.Empty);
            _fileName = string.Format("{0}{1}", _fileName, fileName.Substring(fileName.LastIndexOf(".")));
            return _fileName;
        }

        public static FileStream GetFileStream(string fileName, int size)
        {
            string realFileName = UploadController.GetFileName(fileName, size);
            return System.IO.File.Open(
                string.Format("{0}{1}", 
                    ApplicationSettings.Instance.UploadTmpDirectory, 
                    realFileName), 
                System.IO.FileMode.Open);
        }
	}
}