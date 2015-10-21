using Microsoft.Practices.Unity;
using Microsoft.Practices.Unity.InterceptionExtension;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Pilot.Util.Logging;
using Pilot.Util.Transaction;
using Pilot.Util.Unity.Factory;
using Pilot.Util.Unity.Lifetime;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using Unity.SelfHostWebApiOwin;

namespace Pilot.Test.Config
{
    public class TestContextConfig
    {
        private static volatile IUnityContainer unityContainer;
        public static IUnityContainer UnityContainer
        {
            get
            {
                return unityContainer;
            }
        }
        private static volatile TestContextConfig instance;
        private static object syncRoot = new Object();

        private TestContextConfig() { }

        public static TestContextConfig Instance
        {
            get
            {
                if (instance == null)
                {
                    lock (syncRoot)
                    {
                        if (instance == null)
                            instance = new TestContextConfig();
                    }
                }

                return instance;
            }
        }

        public void SetupNDbUnit(TestContext testContext)
        {
            object[] attributes = Type.GetType(testContext.FullyQualifiedTestClassName)
                .GetMethod(testContext.TestName).GetCustomAttributes(typeof(DatasetMappingAttribute), true);
            DatasetMappingAttribute mapping = attributes.Length > 0 ? (DatasetMappingAttribute)attributes[0] : null;

            if (mapping != null)
            {
                string connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["Pilot.Database.EntityContext"].ConnectionString;
                using (System.Data.IDbConnection connection = System.Data.SqlClient.SqlClientFactory.Instance.CreateConnection())
                {
                    connection.ConnectionString = connectionString;
                    // System.Data.SQLite, Version=1.0.66.0, Culture=neutral, PublicKeyToken=db937bc2d44ff139
                    NDbUnit.Core.INDbUnitTest mySqliteDatabase = new NDbUnit.Core.SqlClient.SqlDbUnitTest(connection);

                    string xsd = string.Format(@"{0}\..\..\{1}\{2}", 
                        testContext.TestRunDirectory, 
                        Type.GetType(testContext.FullyQualifiedTestClassName).Assembly.GetName().Name, 
                        mapping.SchemeXsd);
                    string[] xml;
                    if (string.IsNullOrWhiteSpace(mapping.DataXml)) {
                        xml = mapping.DataColletionXml.Select(dataXml => string.Format(@"{0}\..\..\{1}\{2}",
                            testContext.TestRunDirectory,
                            Type.GetType(testContext.FullyQualifiedTestClassName).Assembly.GetName().Name,
                            dataXml)).ToArray();
                    } else {
                        xml = new string[] { string.Format(@"{0}\..\..\{1}\{2}", 
                        testContext.TestRunDirectory, 
                        Type.GetType(testContext.FullyQualifiedTestClassName).Assembly.GetName().Name, 
                        mapping.DataXml) };
                    }

                    mySqliteDatabase.ReadXmlSchema(xsd);
                    string singleDataXml = string.Empty;
                    for (int i = 0, len = xml.Length; i < len; i++)
                    {
                        singleDataXml = xml[i];
                        if (i == 0) 
                        {
                            mySqliteDatabase.ReadXml(singleDataXml);
                        } 
                        else 
                        {
                            mySqliteDatabase.AppendXml(singleDataXml);
                        }
                    }

                    mySqliteDatabase.PerformDbOperation(NDbUnit.Core.DbOperationFlag.CleanInsertIdentity);
                }
            }
        }

        public void SetupUnity(TestContext testContext)
        {
            unityContainer = new UnityContainer();

            //Set container for Controller Factory
            MvcUnityContainer.Container = unityContainer;

            //Set for Controller Factory
            ControllerBuilder.Current.SetControllerFactory(typeof(UnityControllerFactory));

            Func<System.Type, Microsoft.Practices.Unity.LifetimeManager> PerRequest = (x) => new PerRequestLifetimeManager(testContext);

            unityContainer.AddNewExtension<Interception>();
            unityContainer
                    .RegisterTypes(UnityHelpers.GetTypesWithCustomAttribute<UnityIoCPerRequestLifetimeAttribute>(new Assembly[]{
                                            Assembly.Load("Pilot.Database"),
                                            Assembly.Load("Pilot.Service"),
                                            Assembly.Load("PilotMvc"),
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
                                            Assembly.Load("Pilot.Service"),
                                            Assembly.Load("PilotMvc"),
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
                                            Assembly.Load("Pilot.Service"),
                                            Assembly.Load("PilotMvc"),
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
