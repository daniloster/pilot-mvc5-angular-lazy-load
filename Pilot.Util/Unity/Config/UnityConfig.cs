using System;
using Microsoft.Practices.Unity;
using Microsoft.Practices.Unity.Configuration;
using Microsoft.Practices.Unity.InterceptionExtension;
using Pilot.Util.Logging;
using Pilot.Util.Unity;
using Unity.SelfHostWebApiOwin;
using Pilot.Util.Unity.Lifetime;
using Pilot.Util.Transaction;
using System.Web.Mvc;
using Pilot.Util.Unity.Factory;

namespace Pilot.Util.Config
{
    /// <summary>
    /// Specifies the Unity configuration for the main container.
    /// </summary>
    public class UnityConfig
    {
        #region Unity Container
        private static Lazy<IUnityContainer> container = new Lazy<IUnityContainer>(() =>
        {
            var container = new UnityContainer();
            RegisterTypes(container);

            //Set container for Controller Factory
            MvcUnityContainer.Container = container;

            //Set for Controller Factory
            ControllerBuilder.Current.SetControllerFactory(typeof(UnityControllerFactory));

            return container;
        });

        public static IUnityContainer GetConfiguredContainer()
        {
            return container.Value;
        }
        #endregion



        public static T Resolve<T>()
        {
            T obj = default(T);

            if (container.Value.IsRegistered(typeof(T)))
            {
                return container.Value.Resolve<T>();
            }

            return obj;
        }

        public static void RegisterTypes(IUnityContainer container)
        {
            container.AddNewExtension<Interception>();
            container
                    .RegisterTypes(UnityHelpers.GetTypesWithCustomAttribute<UnityIoCPerRequestLifetimeAttribute>(AppDomain.CurrentDomain.GetAssemblies()),
                                    WithMappings.FromMatchingInterface,
                                    WithName.Default,
                                    PerRequest,
                                    getInjectionMembers: t => new InjectionMember[]
                                    {
                                        new Interceptor<InterfaceInterceptor>(),
                                        new InterceptionBehavior<DiagnosisBehaviour>(),
                                        new InterceptionBehavior<TransactionBehaviour>()
                                    })
                    .RegisterTypes(UnityHelpers.GetTypesWithCustomAttribute<UnityIoCTransientLifetimeAttribute>(AppDomain.CurrentDomain.GetAssemblies()),
                                    WithMappings.FromMatchingInterface,
                                    WithName.Default,
                                    WithLifetime.Transient,
                                    getInjectionMembers: t => new InjectionMember[]
                                    {
                                        new Interceptor<InterfaceInterceptor>(),
                                        new InterceptionBehavior<DiagnosisBehaviour>(),
                                        new InterceptionBehavior<TransactionBehaviour>()
                                    }
                                )
                    // Same as singleton
                    .RegisterTypes(UnityHelpers.GetTypesWithCustomAttribute<UnityIoCContainerControlledLifetimeAttribute>(AppDomain.CurrentDomain.GetAssemblies()),
                                    WithMappings.FromMatchingInterface,
                                    WithName.Default,
                                    WithLifetime.ContainerControlled);
        }

        public static Func<System.Type, Microsoft.Practices.Unity.LifetimeManager> PerRequest = (x) => new PerRequestLifetimeManager();


        /***************************************************************************************************
         * 
         * Built in Lifetime Management
         * 
         * ContainerControlledLifetimeManager : singleton instance with dispose
         * HierarchicalLifetimeManager : singleton instance per container with dispose
         * TransientLifetimeManager : empty manager, always returns new object by resolve, no dispose!
         * PerRequestLifetimeManager (Unity.MVC) : singleton instance per http request with dispose
         * ExternallyControlledLifetimeManager : code must handle lifetime management
         * PerResolveLifetimeManager : like TransientLifetimeManager expect when in same object graph
         * PerThreadLifetimeManager : A LifetimeManager that holds the instances given to it, keeping one instance per thread.
         */

        /***************************************************************************************************
         * The application could use 3 different lifetime managers:
         * 
         * singleton
         * per request
         * always new
         * An attribute will be used to register all Types to be registered by convention. To do this, a new attribute has to be created.
         */
    }
}
