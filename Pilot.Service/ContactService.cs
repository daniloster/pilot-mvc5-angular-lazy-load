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
    public class ContactService : CRUDService<Contact>, IContactService
    {
        public ContactService(IEntityContext<Contact> db) : base(db) { }

        public override void Save(Contact entity)
        {
            ValidateRequiredProperties(entity);
            base.Save(entity);
        }

        private void ValidateRequiredProperties(Contact entity)
        {
            if (entity == null)
            {
                throw new ValidationException("A contact is required to save into database.", string.Format("{0} entity", typeof(Contact).Name));
            }

            if (entity.MemberId <= 0)
            {
                throw new ValidationException("Member is required.",
                    string.Format("{0} entity.{1}", typeof(Contact).Name, "MemberId"));
            }

            if (entity.Type == null)
            {
                throw new ValidationException("Type is required.",
                    string.Format("{0} entity.{1}", typeof(Contact).Name, "Type"));
            }

            if (entity.Value == null)
            {
                throw new ValidationException("Contact info is required.",
                    string.Format("{0} entity.{1}", typeof(Contact).Name, "Value"));
            }
        }
    }
}
