using Microsoft.Practices.Unity;
using Microsoft.Practices.Unity.InterceptionExtension;
using Pilot.Util.Logging;
using Pilot.Util.Transaction;
using Pilot.Util.Unity.Factory;
using Pilot.Util.Unity.Lifetime;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Unity.SelfHostWebApiOwin;

namespace Pilot.Wcf.Config
{
    public class WcfContextConfig
    {
        private IUnityContainer unityContainer;
        public static IUnityContainer UnityContainer
        {
            get
            {
                return Instance.unityContainer;
            }
        }
        private static volatile WcfContextConfig instance;
        private static object syncRoot = new Object();

        private WcfContextConfig() { }

        public static WcfContextConfig Instance
        {
            get
            {
                if (instance == null)
                {
                    lock (syncRoot)
                    {
                        if (instance == null)
                        {
                            instance = new WcfContextConfig();
                            instance.SetupUnity();
                        }
                    }
                }

                return instance;
            }
        }

        public void SetupUnity()
        {
            unityContainer = new UnityContainer();

            //Set container for Controller Factory
            MvcUnityContainer.Container = unityContainer;

            //Set for Controller Factory
            //ControllerBuilder.Current.SetControllerFactory(typeof(UnityControllerFactory));

            //var request = new HttpRequest("fake", "https://127.0.0.1", null);
            //var respons = new HttpResponse(new StringWriter());
            //var context = new HttpContext(request, respons);
            //HttpContext.Current = context;

            Func<System.Type, Microsoft.Practices.Unity.LifetimeManager> PerRequest = (x) => new PerRequestLifetimeManager();

            unityContainer.AddNewExtension<Interception>();
            unityContainer
                    .RegisterTypes(UnityHelpers.GetTypesWithCustomAttribute<UnityIoCPerRequestLifetimeAttribute>(new Assembly[]{
                                            Assembly.Load("Pilot.Database"),
                                            Assembly.Load("Pilot.Service")
                                        }
                                    ),
                                    WithMappings.FromMatchingInterface,
                                    WithName.Default,
                                    PerRequest,
                                    getInjectionMembers: t => new InjectionMember[]
                                    {
                                        new Interceptor<InterfaceInterceptor>(),
                                        new InterceptionBehavior<DiagnosisBehaviour>(),
                                        new InterceptionBehavior<TransactionBehaviour>()
                                    })
                    .RegisterTypes(UnityHelpers.GetTypesWithCustomAttribute<UnityIoCPerRequestLifetimeAttribute>(new Assembly[]{
                                            Assembly.Load("Pilot.Util")
                                        }
                                    ),
                                    WithMappings.FromMatchingInterface,
                                    WithName.Default,
                                    PerRequest)
                    .RegisterTypes(UnityHelpers.GetTypesWithCustomAttribute<UnityIoCTransientLifetimeAttribute>(new Assembly[]{
                                            Assembly.Load("Pilot.Database"),
                                            Assembly.Load("Pilot.Service")
                                        }
                                    ),
                                    WithMappings.FromMatchingInterface,
                                    WithName.Default,
                                    WithLifetime.Transient,
                                    getInjectionMembers: t => new InjectionMember[]
                                    {
                                        new Interceptor<InterfaceInterceptor>(),
                                        new InterceptionBehavior<DiagnosisBehaviour>()
                                    }
                                )
                    // Same as singleton
                    .RegisterTypes(UnityHelpers.GetTypesWithCustomAttribute<UnityIoCContainerControlledLifetimeAttribute>(new Assembly[]{
                                            Assembly.Load("Pilot.Database"),
                                            Assembly.Load("Pilot.Service")
                                        }
                                    ),
                                    WithMappings.FromMatchingInterface,
                                    WithName.Default,
                                    WithLifetime.ContainerControlled);
        }

        public static T Resolve<T>()
        {
            T obj = default(T);

            if (UnityContainer.IsRegistered(typeof(T)))
            {
                return UnityContainer.Resolve<T>();
            }

            return obj;
        }
    }
}
