using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Entity.Domain
{
    public class ContactType
    {
        public short Id { get; private set; }
        public string Description { get; private set; }

        public static readonly ContactType Address = new ContactType() { Id = 1, Description = "Address" };
        public static readonly ContactType Email = new ContactType() { Id = 2, Description = "E-mail" };
        public static readonly ContactType Cel = new ContactType() { Id = 3, Description = "Cel" };
        public static readonly ContactType Tel = new ContactType() { Id = 4, Description = "Tel" };

        public static readonly IList<ContactType> List = new ContactType[] { Address, Email, Cel, Tel }.ToArray<ContactType>();

        public static ContactType Get(short id)
        {
            for (short idx = 0, len = Convert.ToInt16(ContactType.List.Count); idx < len; idx++)
            {
                if (ContactType.List[idx].Id == id)
                {
                    return ContactType.List[idx];
                }
            }
            return null;
        }
    }
}
