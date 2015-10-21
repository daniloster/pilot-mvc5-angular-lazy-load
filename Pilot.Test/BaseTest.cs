using System;
using System.Text;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Pilot.Test.Config;
using Microsoft.Practices.Unity;
using Pilot.Service.Interfaces;

namespace Pilot.Test
{
    /// <summary>
    /// Summary description for UnitTest1
    /// </summary>
    [TestClass]
    public class BaseTest
    {
        public BaseTest()
        {
            //
            // TODO: Add constructor logic here
            //
        }

        private TestContext testContextInstance;

        /// <summary>
        ///Gets or sets the test context which provides
        ///information about and functionality for the current test run.
        ///</summary>
        public TestContext TestContext
        {
            get
            {
                return testContextInstance;
            }
            set
            {
                testContextInstance = value;
            }
        }

        public string TestProjectPath
        {
            get
            {
                if (TestContext == null)
                {
                    return string.Empty;
                }
                else
                {
                    return string.Format(@"{0}\..\..\{1}\",
                        TestContext.TestRunDirectory,
                        Type.GetType(TestContext.FullyQualifiedTestClassName).Assembly.GetName().Name);
                }
            }
        }

        //[AssemblyInitialize()]
        //public static void AssemblyInit(TestContext context)
        //{
        //    TestContextConfig.Instance.SetupUnity(context);

        //}

        [TestInitialize()]
        public void Initialize()
        {
            TestContextConfig.Instance.SetupUnity(TestContext);
            try
            {
                TestContextConfig.Resolve<IUserService>().Get(1);
            }
            catch { }
            TestContextConfig.Instance.SetupNDbUnit(TestContext);
        }

        #region Additional test attributes
        //
        // You can use the following additional attributes as you write your tests:
        //
        //[TestMethod()]
        //[ExpectedException(typeof(System.DivideByZeroException))]
        //public void DivideMethodTest()
        //{
        //    DivideClass target = new DivideClass();
        //    int a = 0;
        //    int actual;
        //    actual = target.DivideMethod(a);
        //}
        //[AssemblyInitialize()]
        //public static void AssemblyInit(TestContext context)
        //{
        //    MessageBox.Show("Assembly Init");
        //}
        //[AssemblyCleanup()]
        //public static void AssemblyCleanup()
        //{
        //    MessageBox.Show("AssemblyCleanup");
        //}
        // Use ClassInitialize to run code before running the first test in the class
        // [ClassInitialize()]
        // public static void MyClassInitialize(TestContext testContext) { }
        //
        // Use ClassCleanup to run code after all tests in a class have run
        // [ClassCleanup()]
        // public static void MyClassCleanup() { }
        //
        // Use TestInitialize to run code before running each test 
        // [TestInitialize()]
        // public void MyTestInitialize() { }
        //
        // Use TestCleanup to run code after each test has run
        // [TestCleanup()]
        // public void MyTestCleanup() { }
        //
        #endregion
    }
}
