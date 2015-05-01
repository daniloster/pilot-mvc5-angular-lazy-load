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
            /// To import data
            //base.Configuration.AutoDetectChangesEnabled = false;
            //base.Configuration.ValidateOnSaveEnabled = false;
        }

        public DbSet<Member> Members
        {
            get
            {
                return this.Set<Member>();
            }
        }
        public DbSet<Contact> Contacts
        {
            get
            {
                return this.Set<Contact>();
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
