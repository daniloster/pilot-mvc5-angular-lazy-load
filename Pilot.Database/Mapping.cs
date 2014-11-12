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
            //one-to-many
            //modelBuilder.Entity<Member>().HasMany<Contact>(m => m.Contacts)
            //.WithRequired(c => c.Member).HasForeignKey(c => c.MemberId);
            modelBuilder.Entity<Contact>()
            .HasRequired(c => c.Member)
            .WithMany(m => m.Contacts)
            .Map(m => m.MapKey("MemberId"));

            //modelBuilder.Entity<StockMarketCurrentData>()
            //.HasRequired<StockMarketData>(cd => cd.IrelandIEXData);

            //one-to-many
            //modelBuilder.Entity<Contact>()
            //.HasRequired(c => c.Member)
            //.WithMany(m => m.Contacts)
            //.Map(cts => cts.MapKey("MemberId"));

            //modelBuilder.Entity<Course>()
            //.HasRequired(t => t.Department)
            //.WithMany(t => t.Courses)
            //.HasForeignKey(d => d.DepartmentID)
            //.WillCascadeOnDelete(false);
        }
    }
}
