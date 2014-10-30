using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Entity
{
    public interface IBaseEntity
    {
        long Id { get; set; } 
    }
}
