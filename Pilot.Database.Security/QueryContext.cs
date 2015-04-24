using Pilot.Database.Security.Interfaces;
using Pilot.Entity.Security;
using Pilot.Util.Unity.Lifetime;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Database.Security
{
    [UnityIoCTransientLifetime]
    public class QueryContext : EntityContext<Member>, IQueryContext
    {
        public QueryContext()
            : base() { }

        #region Not implemented methods
        public override void Save(Member entity)
        {
            throw new Exception("Not implemented");
        }

        public override void Delete(long id)
        {
            throw new Exception("Not implemented");
        }

        public override void Delete(Member entity)
        {
            throw new Exception("Not implemented");
        }

        public override IQueryable AsQueryable()
        {
            throw new Exception("Not implemented");
        } 
        #endregion

        public DbSet<Member> Members { get; set; }
        public DbSet<Contact> Contacts { get; set; }
    }
}
