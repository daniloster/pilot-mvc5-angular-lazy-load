using Pilot.Entity;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Database
{
    public class Mapping
    {
        internal static void DoMapping(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasMany(e => e.Roles).WithMany();

            modelBuilder.Entity<Role>().HasMany(e => e.Resources).WithMany();
            modelBuilder.Entity<Role>().HasRequired(e => e.Application).WithMany();

            modelBuilder.Entity<Resource>().HasRequired(e => e.Application).WithOptional();
        }
    }
}
