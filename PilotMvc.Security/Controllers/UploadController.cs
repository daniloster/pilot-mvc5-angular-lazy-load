using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Pilot.Util.Unity.Lifetime;
using Pilot.Entity.Security;
using Pilot.Util.Exceptions;
using Pilot.Util.Mvc;
using Pilot.Service.Security.Interfaces;
using Microsoft.Practices.Unity;
using Pilot.Util.Security;
using Pilot.Util.Data;
using System.IO;
using Pilot.Util.Logging;
using System.Drawing;
using Pilot.Util.Files;

namespace PilotMvc.Security.Controllers
{
    [RoutePrefix("upload")]
    public class UploadController : BaseController
    {
        [Route("imagePng"), HttpPost, HandleUIException]
        public JsonResult ImagePng(string imageName, string imageValue, string folderType)
        {
            try
            {
                string fileName = FileUtil.GetFileName(imageName, imageValue.Length, true);

                string partialPath = FileUtil.GetPartialDirectory(folderType);
                string savingPath = FileUtil.GetFullDirectoryFromRelative(partialPath);
                string displayFolder = FileUtil.GetTempOne(partialPath);
                string savingPathTemp = FileUtil.GetTempOne(savingPath);

                if (!Directory.Exists(savingPath))
                {
                    Directory.CreateDirectory(savingPath);
                }

                if (!Directory.Exists(savingPathTemp))
                {
                    Directory.CreateDirectory(savingPathTemp);
                }

                string finalPath = string.Format("{0}{1}", savingPathTemp, fileName);

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
                    });
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
                string fileName = FileUtil.GetFileName(file.FileName, file.ContentLength);

                string partialPath = FileUtil.GetPartialDirectory(folderType);
                string savingPath = FileUtil.GetFullDirectoryFromRelative(partialPath);
                string displayFolder = FileUtil.GetTempOne(partialPath);
                string savingPathTemp = FileUtil.GetTempOne(savingPath);

                if (!Directory.Exists(savingPath))
                {
                    Directory.CreateDirectory(savingPath);
                }

                if (!Directory.Exists(savingPathTemp))
                {
                    Directory.CreateDirectory(savingPathTemp);
                }

                string finalPath = string.Format("{0}{1}", savingPathTemp, fileName);

                file.SaveAs(finalPath);

                LoggerFile.AppendLogSafe(string.Format("@ FILE UPLOAD: {0} ==> SIZE: {1} ==> FILE TOKEN: {2}", file.FileName, file.ContentLength, fileName));

                return new JsonResultView(
                    new
                    {
                        FileName = fileName,
                        Size = file.ContentLength,
                        FilePreview = (displayFolder) + "\\" + fileName
                    });
            }
            catch (Exception e)
            {
                throw new JsonException(e);
            }
        }
	}
}