using Pilot.Entity;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Database.Interfaces
{
    public interface IQueryContext : IEntityContext<Member>
    {
        DbSet<Member> Members { get; set; }
        DbSet<Contact> Contacts { get; set; }
    }
}
