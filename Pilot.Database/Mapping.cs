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
            modelBuilder.Entity<User>().HasMany(e => e.Roles).WithMany()
                .Map(m =>
                {
                    m.ToTable("UserRoles");
                    m.MapLeftKey("User_Id");
                    m.MapRightKey("Role_Id");
                });

            modelBuilder.Entity<Resource>().HasRequired(e => e.Application).WithMany().WillCascadeOnDelete(false);

            modelBuilder.Entity<Role>().HasRequired(e => e.Application).WithMany().WillCascadeOnDelete(false);
            modelBuilder.Entity<Role>().HasMany(e => e.Resources).WithMany()
                .Map(m =>
                {
                    m.ToTable("RoleResources");
                    m.MapLeftKey("Role_Id");
                    m.MapRightKey("Resource_Id");
                });
        }
    }
}
