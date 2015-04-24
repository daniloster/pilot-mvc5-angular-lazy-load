﻿using Pilot.Entity.Security.Domain;
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

    public class Resource : BaseEntity
    {
        [Required]
        public string Value { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public short ResourceTypeId { get; set; }
        [NotMapped]
        public ResourceType ResourceType { get { return ResourceType.Get(ResourceTypeId); } }

        [Editable(false)]
        [Required]
        public virtual System System { get; set; }
    }
}
