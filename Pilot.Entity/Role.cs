using Pilot.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Entity
{
    [Table("Roles")]
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
        public virtual Application Application { get; set; }

        [NotMapped]
        public string GroupDescription
        {
            get
            {
                return string.Format("{0} | {1}", Application.Name, Description);
            }
        }

        public Role()
        {
            Resources = new List<Resource>();
            IsAdmin = false;
        }
    }
}
