using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics.Tracing;
using Pilot.Util.Data;

namespace Pilot.Util.Logging
{
    //[EventSource(Name = "DiagnosisEvents")]
    public class DiagnosisEvents : EventSource
    {
        public static readonly DiagnosisEvents Log = new DiagnosisEvents();

        private const int methodEnterEventId = 1;
        private const int methodLeaveEventId = 2;
        private const int logVerboseMessageEventId = 3;
        private const int logInfoMessageEventId = 4;

        static DiagnosisEvents()
        {
            EventSourceCreator.CreateSourceIfNotExists(
                ApplicationSettings.Instance.LoggingSourceName,
                ApplicationSettings.Instance.LoggingTargetLogName);
            LoggerFile.InstanceForSubject(ApplicationSettings.Instance.LoggingSubject);
        }

        public new bool IsEnabled()
        {
            return ApplicationSettings.Instance.LoggingEnabled;
        }

        public new bool IsFileEnabled()
        {
            return ApplicationSettings.Instance.LoggingFileLogEnabled;
        }

        [Event(methodEnterEventId, Message = "Method Enter: {0}", Level = EventLevel.Verbose)]
        public void MethodEnter(string message)
        {
            if (IsEnabled())
            {
                WriteEvent(methodEnterEventId, message);
                if (IsFileEnabled())
                {
                    LoggerFile.AppendLogSafe(message);
                }
            }
        }

        [Event(methodLeaveEventId, Message = "Method Leave: {0}", Level = EventLevel.Verbose)]
        public void MethodLeave(string message)
        {
            if (IsEnabled())
            {
                WriteEvent(methodLeaveEventId, message);
                if (IsFileEnabled())
                {
                    LoggerFile.AppendLogSafe(message);
                }
            }
        }

        [Event(logVerboseMessageEventId, Message = "{0}", Level = EventLevel.Verbose)]
        public void LogVerboseMessage(string message)
        {
            if (IsEnabled())
            {
                WriteEvent(logVerboseMessageEventId, message);
                if (IsFileEnabled())
                {
                    LoggerFile.AppendLogSafe(message);
                }
            }
        }

        [Event(logInfoMessageEventId, Message = "{0}", Level = EventLevel.Informational)]
        public void LogInfoMessage(string message)
        {
            if (IsEnabled())
            {
                WriteEvent(logInfoMessageEventId, message);
                if (IsFileEnabled())
                {
                    LoggerFile.AppendLogSafe(message);
                }
            }
        }
    }
}
