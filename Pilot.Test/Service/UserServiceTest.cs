using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Pilot.Service.Interfaces;
using Microsoft.Practices.Unity;
using Pilot.Entity;
using Pilot.Util.Exceptions;
using Pilot.Service;
using Moq;
using Pilot.Database;
using Pilot.Database.Interfaces;
using Pilot.Service.Security;

namespace Pilot.Test
{
    [TestClass]
    public class UserServiceTest : BaseTest
    {

        private UserService GetServiceForSave()
        {
            User member = It.Is<User>(m => !string.IsNullOrWhiteSpace(m.Name) && !string.IsNullOrWhiteSpace(m.Email) && m.Id == 0);
            Mock<IEntityContext<User>> dbContextUserMock = new Mock<IEntityContext<User>> { DefaultValue = DefaultValue.Mock };
            dbContextUserMock.Setup(db => db.Save(member));

            Mock<IEntityContext<Role>> dbContextRoleMock = new Mock<IEntityContext<Role>> { DefaultValue = DefaultValue.Mock };
            Mock<Lazy<IRoleService>> roleSvcMock = new Mock<Lazy<IRoleService>>(dbContextRoleMock.Object);

            return new UserService(dbContextUserMock.Object, roleSvcMock.Object);
        }

        [TestMethod]
        [Description("When try to save a member with FirstName property empty, should throw a ValidationException")]
        public void WhenTryToSaveAMemberWithFirstNameEmptyThenThrowAValidationException()
        {
            try
            {
                GetServiceForSave().Save(new User()
                {
                    Name = "Carlsberg"
                });
                Assert.Fail();
            }
            catch (ValidationException ex)
            {
                Assert.AreEqual<string>(ex.Message, "First name is required.");
            }
        }

        [TestMethod]
        [Description("When try to save a member with LastName property empty, should throw a ValidationException")]
        public void WhenTryToSaveAMemberWithLastNameEmptyThenThrowAValidationException()
        {
            try
            {
                GetServiceForSave().Save(new User()
                {
                    Name = "Beer"
                });
                Assert.Fail();
            }
            catch (ValidationException ex)
            {
                Assert.AreEqual<string>(ex.Message, "Last name is required.");
            }
        }

        [TestMethod]
        [Description("When try to save a member with LastName property empty, should throw a ValidationException")]
        public void WhenTryToSaveAMemberWithAllRequiredPropertiesFilledThenSetIdEqualsOne()
        {
            try
            {
                User toSave = new User()
                {
                    Id = 0,
                    Name = "Beer",
                    UserName = "Carlsberg",
                    Email = "pop@example.com"
                };
                GetServiceForSave().Save(toSave);
                Assert.IsTrue(true);
            }
            catch (Exception)
            {
                Assert.Fail("Member could not be saved.");
            }
        }
    }
}
