using Microsoft.Practices.Unity;
using Pilot.Entity;
using Pilot.Service.Interfaces;
using Pilot.Util.Exceptions;
using Pilot.Util.Unity.Lifetime;
using Pilot.Wcf.Config;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace Pilot.Wcf
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "Service1" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select Service1.svc or Service1.svc.cs at the Solution Explorer and start debugging.
    //[UnityIoCContainerControlledLifetime]
    public class WcfMemberService : IWcfMemberService
    {
        [Dependency]
        public IMemberService MyService { get; set; }

        //public WcfMemberService() {
        //    MyService = WcfContextConfig.Resolve<IWcfMemberService>();
        //}

        public string GetData(Member member)
        {
            try
            {
                return string.Format("You entered: {0} with ID: ", member.FirstName, member.Id);
            }
            catch (Exception e)
            {
                throw new FaultException<string>(e.Message, new FaultReason(e.StackTrace));
            }
        }

        public CompositeType GetDataUsingDataContract(CompositeType composite)
        {
            if (composite == null)
            {
                throw new ArgumentNullException("composite");
            }
            if (composite.BoolValue)
            {
                composite.StringValue += "Suffix";
            }
            return composite;
        }
    }
}
