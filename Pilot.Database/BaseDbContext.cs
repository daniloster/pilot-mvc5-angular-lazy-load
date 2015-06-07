using Microsoft.Practices.Unity;
using Pilot.Database.Interfaces;
using Pilot.Entity;
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

namespace Pilot.Database
{
    [UnityIoCPerRequestLifetime]
    public class BaseDbContext : DbContext, IBaseDbContext
    {
        public BaseDbContext()
            : base("name=Pilot.Database.EntityContext")
        {
            base.Configuration.ProxyCreationEnabled = false;
            if (base.Database.Exists() && !base.Database.CompatibleWithModel(false))
            {
                base.Database.Delete();
            }
            //if (base.Database.Exists())
            //{
            //    base.Database.Delete();
            //}
            base.Database.CreateIfNotExists();
            /// To import data
            //base.Configuration.AutoDetectChangesEnabled = false;
            //base.Configuration.ValidateOnSaveEnabled = false;
        }

        public DbSet<Resource> Resources
        {
            get
            {
                return this.Set<Resource>();
            }
        }

        public DbSet<Application> Applications
        {
            get
            {
                return this.Set<Application>();
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
