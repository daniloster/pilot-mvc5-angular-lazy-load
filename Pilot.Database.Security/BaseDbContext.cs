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

        public DbSet<Resource> Resources
        {
            get
            {
                return this.Set<Resource>();
            }
        }

        public DbSet<Pilot.Entity.Security.System> Systems
        {
            get
            {
                return this.Set<Pilot.Entity.Security.System>();
            }
        }

        public DbSet<Role> Roles
        {
            get
            {
                return this.Set<Role>();
            }
        }

        public DbSet<User> Users
        {
            get
            {
                return this.Set<User>();
            }
        }
        

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
