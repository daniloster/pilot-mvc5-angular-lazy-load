using Pilot.Entity.Security;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Database.Security.Interfaces
{
    public interface IQueryContext : IEntityContext<Member>
    {
        DbSet<Member> Members { get; set; }
        DbSet<Contact> Contacts { get; set; }
    }
}
