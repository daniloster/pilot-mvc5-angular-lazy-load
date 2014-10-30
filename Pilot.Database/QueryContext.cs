using Pilot.Database.Interfaces;
using Pilot.Entity;
using Pilot.Util.Unity.Lifetime;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Database
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
