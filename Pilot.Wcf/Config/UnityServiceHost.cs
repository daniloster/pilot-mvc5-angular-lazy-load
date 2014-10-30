using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Web;

namespace Pilot.Wcf.Config
{
    public class UnityServiceHost : ServiceHost
    {
        public UnityContainer Container { get; set; }


        public UnityServiceHost()
            : base()
        {
            Container = WcfContextConfig.UnityContainer as UnityContainer;
        }

        public UnityServiceHost(Type serviceType, params Uri[] baseAddresses)
            : base(serviceType, baseAddresses)
        {
            Container = new UnityContainer();
        }

        protected override void OnOpening()
        {
            base.OnOpening();

            if (this.Description.Behaviors.Find<UnityServiceBehavior>() == null)
                this.Description.Behaviors.Add(new UnityServiceBehavior(Container));

        }
    }
}