using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Web;

namespace Pilot.Wcf.Config
{
    public class UnityServiceHostFactory : ServiceHostFactory
    {
        protected override ServiceHost CreateServiceHost(Type serviceType, Uri[] baseAddresses)
        {
            UnityServiceHost serviceHost = new UnityServiceHost(serviceType, baseAddresses);
            //UnityContainer container = new UnityContainer();
            //serviceHost.Container = container;
            serviceHost.Container = WcfContextConfig.UnityContainer as UnityContainer;

            //configure container
            //UnityConfigurationSection section = (UnityConfigurationSection)ConfigurationManager.GetSection("unity");
            //section.Configure(serviceHost.Container);
            return serviceHost;
        }
    }
}