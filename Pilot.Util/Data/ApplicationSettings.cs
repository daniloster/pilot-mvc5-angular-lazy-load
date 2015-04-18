using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Util.Data
{
    public class ApplicationSettings
    {
        static readonly object padlock = new object();
        private static ApplicationSettings instance;
        public static ApplicationSettings Instance
        {
            get
            {
                lock (padlock)
                {
                    if (instance == null)
                    {
                        instance = new ApplicationSettings();
                        instance.LoadSettings();
                    }
                    return instance;
                }
            }
        }

        static ApplicationSettings() 
        {
            ApplicationSettings.Instance.ToString();
        }

        private ApplicationSettings() { }

        private void LoadSettings()
        {
            List<string> keys = new List<string>(ConfigurationManager.AppSettings.AllKeys);
            PropertyInfo[] properties = typeof(ApplicationSettings).GetProperties(BindingFlags.Instance | BindingFlags.Public);
            object currentValue;
            for (int idx = 0, len = properties.Length; idx < len; idx++)
            {
                if (keys.Contains(properties[idx].Name))
                { 
                    currentValue = ConfigurationManager.AppSettings[properties[idx].Name];
                    currentValue = Convert.ChangeType(currentValue, properties[idx].PropertyType);
                    properties[idx].SetValue(instance, currentValue);
                }
            }
        }

        public string ApplicationName { get; set; }
        public bool LoggingEnabled { get; set; }
        public string LoggingSourceName { get; set; }
        public string LoggingTargetLogName { get; set; }
        public bool LoggingFileLogEnabled { get; set; }
        public string LoggingSubject { get; set; }
        public string LoggingPath { get; set; }
        public string UploadTmpDirectory { get; set; }
        public string ProfilePath { get; set; }
    }
}

