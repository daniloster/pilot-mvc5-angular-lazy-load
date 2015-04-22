using Pilot.Database.Interfaces;
using Pilot.Entity;
using Pilot.Entity.Domain;
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
    public class ContactService : CRUDService<Contact>, IContactService
    {
        public ContactService(IEntityContext<Contact> db) : base(db) { }

        public IList<ContactType> GetContactTypes()
        {
            return ContactType.List;
        }

        public IList<Contact> GetWithMember()
        {
            return db.DbContext.Contacts.Include(c => c.Member).ToList();
        }

        public override void Save(Contact entity)
        {
            ValidateRequiredProperties(entity);
            entity.Member = db.GetAttachedEntity<Member>(entity.Member);
            base.Save(entity);
        }

        private void ValidateRequiredProperties(Contact entity)
        {
            entity.Assert<Contact>("A contact is required to save into database.", e => e != null);
            entity.Assert<Contact>("Type is required.", e => e.Type != null);
            entity.Assert<Contact>("Contact info is required.", e => !e.Value.IsNullOrWhiteSpace());
        }
    }
}
