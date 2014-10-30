using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Entity
{
    [DataContract]
    public class Member : IBaseEntity
    {
        public Member() 
        {
            Contacts = new HashSet<Contact>();
        }

        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        [DataMember]
        public long Id { get; set; }
        [DataMember]
        public string FirstName { get; set; }
        [DataMember]
        public string LastName { get; set; }
        [DataMember]
        public string Email { get; set; }
        [DataMember]
        public virtual ICollection<Contact> Contacts { get; set; }

        [NotMapped]
        public IList<Contact> ContactList
        {
            get { return new List<Contact>(Contacts); }
        }
    }
}
