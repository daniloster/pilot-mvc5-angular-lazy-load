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

namespace Pilot.Test
{
    [TestClass]
    public class MemberServiceTest : BaseTest
    {

        private MemberService GetServiceForSave()
        {
            Member member = It.Is<Member>(m => !string.IsNullOrWhiteSpace(m.FirstName) && !string.IsNullOrWhiteSpace(m.LastName) && m.Id == 0);
            Mock<IEntityContext<Member>> dbContextMemberMock = new Mock<IEntityContext<Member>> { DefaultValue = DefaultValue.Mock };
            
            Mock<IEntityContext<Contact>> dbContextContactMock = new Mock<IEntityContext<Contact>> { DefaultValue = DefaultValue.Mock };
            dbContextMemberMock.Setup(db => db.Save(member));
            Mock<ContactService> contactSvcMock = new Mock<ContactService>(dbContextContactMock.Object);

            return new MemberService(dbContextMemberMock.Object/*, contactSvcMock.Object*/);
        }

        [TestMethod]
        [Description("When try to save a member with FirstName property empty, should throw a ValidationException")]
        public void WhenTryToSaveAMemberWithFirstNameEmptyThenThrowAValidationException()
        {
            try
            {
                GetServiceForSave().Save(new Member()
                {
                    LastName = "Carlsberg"
                });
                Assert.Fail();
            }
            catch (ValidationException ex)
            {
                Assert.AreEqual<string>(ex.SourceError, string.Format("{0} entity.{1}", typeof(Member).Name, "FirstName"));
            }
        }

        [TestMethod]
        [Description("When try to save a member with LastName property empty, should throw a ValidationException")]
        public void WhenTryToSaveAMemberWithLastNameEmptyThenThrowAValidationException()
        {
            try
            {
                GetServiceForSave().Save(new Member()
                {
                    FirstName = "Beer"
                });
                Assert.Fail();
            }
            catch (ValidationException ex)
            {
                Assert.AreEqual<string>(ex.SourceError, string.Format("{0} entity.{1}", typeof(Member).Name, "LastName"));
            }
        }

        [TestMethod]
        [Description("When try to save a member with LastName property empty, should throw a ValidationException")]
        public void WhenTryToSaveAMemberWithAllRequiredPropertiesFilledThenSetIdEqualsOne()
        {
            try
            {
                Member toSave = new Member()
                {
                    Id = 0,
                    FirstName = "Beer",
                    LastName = "Carlsberg"
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
