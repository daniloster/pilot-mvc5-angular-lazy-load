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
            User user = new User();
            user.UserName = "daniloster";
            user.Email = "daniloster@gmail.com";
            user.UpdatePassword("123");
            Assert.AreEqual<string>(user.Password, "9DBFE12741E06DBACA4DDBA9537EBE45");
            user.UserName = "carbonara";
            user.Email = "carbonara@gmail.com";
            user.UpdatePassword("123");
            Assert.AreEqual<string>(user.Password, "9BD275FB8802A78B14CC866EAA3C5");
        }
    }
}
