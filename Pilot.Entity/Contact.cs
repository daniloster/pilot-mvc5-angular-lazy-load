using Pilot.Entity.Domain;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Entity
{
    public class Contact : BaseEntity
    {
        //public long MemberId { get; set; }
        [Editable(false)]
        public virtual Member Member { get; set; } 
        public short ContactTypeId { get; set; }
        public string Value { get; set; }
        public ContactType Type
        {
            get
            {
                return ContactType.Get(ContactTypeId);
            }
        }
    }
}
