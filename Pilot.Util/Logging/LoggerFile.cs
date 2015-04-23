
using Pilot.Util.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Util.Logging
{
    public class LoggerFile
    {
        static readonly object padlock = new object();
        private static LoggerFile instance;

        public string FileLog
        {
            get;
            private set;
        }

        public string Subject
        {
            get;
            private set;
        }

        public static LoggerFile Instance
        {
            get
            {
                lock (padlock)
                {
                    if (instance == null)
                    {
                        string subject;
                        try
                        {
                            subject = ApplicationSettings.Instance.LoggingSubject;
                        }
                        catch (Exception)
                        {
                            subject = "## Starting Logger ##";
                        }
                        return InstanceForSubject(subject);
                    }
                    return instance;
                }
            }
        }

        public static LoggerFile InstanceForSubject(string subject)
        {
            lock (padlock)
            {
                instance = new LoggerFile();
                instance.Subject = subject;
                instance.GenerateFileLogName();
                return instance;
            }
        }

        public void GenerateFileLogName()
        {
            string fileLog;
            try
            {
                fileLog = string.Format("{0}{1}_{2}.txt",
                    ApplicationSettings.Instance.LoggingPath,
                    ApplicationSettings.Instance.LoggingSourceName,
                    DateTime.Now.ToString("u").Replace("-", "_").Replace(":", "_"));
            }
            catch (Exception)
            {
                fileLog = string.Format(@"C:\temp\application_log_{0}.txt",
                DateTime.Now.ToString("u").Replace("-", "_").Replace(":", "_"));
            }
            List<string> pathToLog = fileLog.Split(new char[] { '\\' }).ToList<string>();
            pathToLog.RemoveAt(pathToLog.Count - 1);
            Directory.CreateDirectory(string.Join(@"\", pathToLog));
            FileLog = fileLog;
            System.IO.File.AppendAllLines(FileLog, new string[] {
                Subject, ""
            });
        }

        [Obsolete]
        public void AppendLog(Exception ex)
        {
            if (string.IsNullOrEmpty(FileLog))
            {
                GenerateFileLogName();
            }
            System.IO.File.AppendAllLines(FileLog, new string[] {
                "", string.Format("@[ERROR:BEGIN] {0}", DateTime.Now.ToString("u")),
                string.Format("- Message: {0}", ex.Message),
                string.Format("- Stacktrace: {0}", ex.StackTrace),
                "@[ERROR:END]", ""
            });
        }

        public static void AppendLogSafe(Exception ex)
        {
            lock (padlock)
            {
                System.IO.File.AppendAllLines(LoggerFile.Instance.FileLog, new string[] {
                    "", string.Format("@[ERROR:BEGIN] {0}", DateTime.Now.ToString("u")),
                    string.Format("- Message: {0}", ex.Message),
                    string.Format("- Stacktrace: {0}", ex.StackTrace),
                    "@[ERROR:END]", ""
                });
            }
        }

        [Obsolete]
        public void AppendLog(string message)
        {
            if (string.IsNullOrEmpty(FileLog))
            {
                GenerateFileLogName();
            }
            System.IO.File.AppendAllLines(FileLog, new string[] { message });
        }

        public static void AppendLogSafe(string message)
        {
            lock (padlock)
            {
                System.IO.File.AppendAllLines(LoggerFile.Instance.FileLog, new string[] { message });
            }
        }

        [Obsolete]
        public void SaveLog(IList<string> messages)
        {
            if (string.IsNullOrEmpty(FileLog))
            {
                GenerateFileLogName();
            }
            System.IO.File.AppendAllLines(FileLog, messages);
        }

        public static void SaveLogSafe(IList<string> messages)
        {
            lock (padlock)
            {
                System.IO.File.AppendAllLines(LoggerFile.Instance.FileLog, messages);
            }
        }
    }
}

