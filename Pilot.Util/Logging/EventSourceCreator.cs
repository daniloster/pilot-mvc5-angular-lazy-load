using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Util.Logging
{
    public class EventSourceCreator
    {
        public static void CreateSourceIfNotExists(string sourceName, string targetLogName)
        {
            try
            {
                if (!EventLog.SourceExists(sourceName))
                {
                    EventLog.CreateEventSource(sourceName, targetLogName);
                    EventLog.WriteEntry(sourceName, "Event source created");
                }
            }
            catch (SecurityException)
            {
                CreateEventSourceWithEventCreateTool(sourceName, targetLogName);
            }
        }

        private static void CreateEventSourceWithEventCreateTool(string sourceName, string targetLogName)
        {
            try
            {
                var eventLogCreateToolName = @"eventcreate";
                var eventLogCreateToolArguments =
                    string.Format(
                        " /ID 1 /L {0} /T INFORMATION  /SO \"{1}\" /D \"{1} source created.\"",
                        targetLogName,
                        sourceName);

                var proc = new Process
                {
                    StartInfo =
                    {
                        FileName = eventLogCreateToolName,
                        Arguments = eventLogCreateToolArguments,
                        Verb = "runas"
                    }
                };

                proc.Start();
                proc.WaitForExit();
            }
            catch (Win32Exception)
            {
                //note: handle if user clicks 'No' on run as administrator UAC dialog
                return;
            }
        }
    }
}
