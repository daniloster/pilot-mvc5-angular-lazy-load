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
    public class MemberServiceTest : BaseTest
    {

        //[TestMethod]
        //[DatasetMapping(SchemeXsd = @"Integrated\Member\Scheme.xsd", DataXml = @"Integrated\Member\Data.xml")]
        //public void WhenTriedToGetMemberWithContactByMemberId1ThenShouldRetrieveMemberDaniloAndContactParnellStreet()
        //{
        //    IMemberService memberSvc = TestContextConfig.Resolve<IMemberService>();
        //    Entity.Member member = memberSvc.GetMemberWithContacts(1);
        //    Assert.IsNotNull(member);
        //    Assert.AreEqual<string>("Danilo", member.FirstName);
        //    Assert.IsNotNull(member.Contacts);
        //    Assert.AreEqual<int>(1, member.Contacts.Count);
        //    Assert.AreEqual<string>("Parnell Street", member.ContactList[0].Value);
        //}

        //[TestMethod]
        //[DatasetMapping(SchemeXsd = @"Integrated\Member\Scheme.xsd", DataXml = @"Integrated\Member\Data.xml")]
        //public void WhenTriedToGetMemberById1ThenShouldRetrieveMemberDanilo()
        //{
        //    IMemberService memberSvc = TestContextConfig.Resolve<IMemberService>();
        //    Entity.Member member = memberSvc.Get(1);
        //    Assert.IsNotNull(member);
        //    Assert.AreEqual<string>("Danilo", member.FirstName);
        //}

        //[TestMethod]
        //[DatasetMapping(SchemeXsd = @"Integrated\Member\Scheme.xsd", DataXml = @"Integrated\Member\Data.xml")]
        //public void WhenTriedInsertingWithAllRequiredPropertiesThenShouldHaveBeenCreatedANewRecord()
        //{
        //    IMemberService memberSvc = TestContextConfig.Resolve<IMemberService>();
        //    Entity.Member member = new Entity.Member(){
        //        Id = 0,
        //        FirstName = "Fulano",
        //        LastName="Beltrano",
        //        Contacts = new HashSet<Contact>(new Contact[] { 
        //            new Contact(){
        //                Id = 0,
        //                ContactTypeId = ContactType.Address.Id,
        //                Value = "Parnell Street"
        //            } 
        //        })
        //    };
        //    memberSvc.Save(member);
        //    member = memberSvc.Get(member.Id);
        //    Assert.IsTrue(member.Id > 0);
        //}

        //[TestMethod]
        //[DatasetMapping(SchemeXsd = @"Integrated\Member\Scheme.xsd", DataXml = @"Integrated\Member\Data.xml")]
        //public void WhenTriedInsertingWithContactMissingRequiredPropertiesThenMustNotRecordMember()
        //{
        //    IMemberService memberSvc = TestContextConfig.Resolve<IMemberService>();
        //    Entity.Member member = new Entity.Member()
        //    {
        //        Id = 0,
        //        FirstName = "Fulano",
        //        LastName = "Beltrano",
        //        Contacts = new HashSet<Contact>(new Contact[] { 
        //            new Contact(){
        //                Id = 0,
        //                //ContactTypeId = ContactType.Address.Id,
        //                Value = "Parnell Street"
        //            } 
        //        })
        //    };
        //    try
        //    {
        //        memberSvc.Save(member);
        //        Assert.Fail();
        //    }
        //    catch (ValidationException)
        //    {
        //        /// It needs to get again because the old instance of EntityContext has in its 
        //        /// collection the wrong data. But it didnt mean that was saved into database. 
        //        /// In fact it didnt.
        //        //TestContextConfig.Instance.SetupUnity(TestContext);
        //        //memberSvc = TestContextConfig.Resolve<IMemberService>();
        //        member = memberSvc.Get(member.Id);
        //        Assert.IsNull(member);
        //    }
        //}
    }
}
