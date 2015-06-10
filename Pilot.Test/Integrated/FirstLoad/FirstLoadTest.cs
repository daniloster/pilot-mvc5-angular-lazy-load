using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Practices.Unity;
using PilotMvc.Controllers;
using Pilot.Test.Config;
using Pilot.Service.Interfaces;
using Pilot.Entity;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Pilot.Entity.Domain;
using Pilot.Service;
using Pilot.Util.Exceptions;

namespace Pilot.Test.Integrated.Member
{
    [TestClass]
    public class FirstLoadTest : BaseTest
    {

        [TestMethod]
        [DatasetMapping(SchemeXsd = @"Integrated\FirstLoad\Scheme.xsd", DataXml = @"Integrated\FirstLoad\Data.xml")]
        public void LoadInitialData()
        {
            Assert.IsTrue(true);
        }
    }
}
