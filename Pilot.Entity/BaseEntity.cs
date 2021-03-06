﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Entity
{
    public partial class BaseEntity : IBaseEntity
    {
        [Key, DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public virtual long Id { get; set; }

        public override int GetHashCode()
        {
            if (Id == 0)
            {
                return base.GetHashCode();
            }
            else
            {
                return Id.GetHashCode();
            }
        }

        public override bool Equals(object obj)
        {
            IBaseEntity comparator = (obj as IBaseEntity);
            return (comparator != null && Id == comparator.Id && this.GetType().Equals(comparator.GetType()));
        }
    }
}
