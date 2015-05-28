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
using System.Data.Entity;

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
                .Include(m => m.Contacts).Where(m => m.Id == id);
            return query.SingleOrDefault();
        }

        public override void Save(Member entity)
        {
            ValidateRequiredProperties(entity);
            entity = GetAttachedEntity(entity);
            base.Save(entity);
            List<Contact> contacts = new List<Contact>((entity.Contacts == null) ? new Contact[0] : entity.Contacts);
            for (short idx = 0, len = (short)contacts.Count; idx < len; idx++)
            {
                ContactSvc.Save(contacts[idx]);
            }
        }

        private void ValidateRequiredProperties(Member entity)
        {
            entity.Assert<Member>("A member is required to save into database.", e => e != null);
            entity.Assert<Member>("First name is required.", e => !e.FirstName.IsNullOrWhiteSpace());
            entity.Assert<Member>("Last name is required.", e => !e.LastName.IsNullOrWhiteSpace());
        }
    
    }
}
