using Microsoft.Practices.Unity;
using Pilot.Database;
using Pilot.Database.Interfaces;
using Pilot.Entity;
using Pilot.Service.Interfaces;
using Pilot.Util.Exceptions;
using Pilot.Util.Transaction;
using Pilot.Util.Unity;
using Pilot.Util.Unity.Lifetime;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Service
{
    [UnityIoCPerRequestLifetime]
    public class MemberService : CRUDService<Member>, IMemberService
    {
        [Dependency]
        public IContactService ContactSvc { get; set; }

        public MemberService(IEntityContext<Member> db) 
            : base(db)  { }

        public Member GetMemberWithContacts(long id)
        {
            var query = this.db.DbContext.Members
                .Include("Contacts").Where(m => m.Id == id);
            return query.SingleOrDefault();
        }

        public override void Save(Member entity)
        {
            ValidateRequiredProperties(entity);
            base.Save(entity);
            List<Contact> contacts = new List<Contact>((entity.Contacts == null) ? new Contact[0] : entity.Contacts);
            for (short idx = 0, len = (short)contacts.Count; idx < len; idx++)
            {
                contacts[idx].MemberId = entity.Id;
                ContactSvc.Save(contacts[idx]);
            }
        }

        private void ValidateRequiredProperties(Member entity)
        {
            if (entity == null)
            {
                throw new ValidationException("A member is required to save into database.", string.Format("{0} entity", typeof(Member).Name));
            }

            if (string.IsNullOrWhiteSpace(entity.FirstName))
            {
                throw new ValidationException("First name is required.", string.Format("{0} entity.{1}", typeof(Member).Name, "FirstName"));
            }

            if (string.IsNullOrWhiteSpace(entity.LastName))
            {
                throw new ValidationException("Last name is required.", string.Format("{0} entity.{1}", typeof(Member).Name, "LastName"));
            }
        }
    
    }
}
