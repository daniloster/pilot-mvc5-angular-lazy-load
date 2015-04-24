using Pilot.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Entity.Security
{
    public class Role : BaseEntity
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        public bool IsAdmin { get; set; }

        [Editable(false)]
        public virtual IList<Resource> Resources { get; set; }

        [Editable(false)]
        [Required]
        public virtual System System { get; set; }

        public Role()
        {
            Resources = new List<Resource>();
            IsAdmin = false;
        }
    }
}
