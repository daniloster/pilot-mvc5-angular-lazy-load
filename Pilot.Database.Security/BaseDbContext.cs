using Microsoft.Practices.Unity;
using Pilot.Database.Security.Interfaces;
using Pilot.Entity.Security;
using Pilot.Util.Transaction;
using Pilot.Util.Unity.Lifetime;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Database.Security
{
    [UnityIoCPerRequestLifetime]
    public class BaseDbContext : DbContext, IBaseDbContext
    {
        public BaseDbContext()
            : base("name=Pilot.Database.Security.EntityContext")
        {
            base.Configuration.ProxyCreationEnabled = false;
        }

        //public DbSet<Member> Members
        //{
        //    get
        //    {
        //        return this.Set<Member>();
        //    }
        //}
        

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Mapping.DoMapping(modelBuilder);
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);
        }

    }
}
