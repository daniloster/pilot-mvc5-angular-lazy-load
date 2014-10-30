using Pilot.Entity;
using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Threading.Tasks;
namespace Pilot.Database.Interfaces
{
    public interface IBaseDbContext : IDisposable, IObjectContextAdapter 
    {
        DbSet<Contact> Contacts { get; /*set;*/ }
        DbSet<Member> Members { get; /*set;*/ }

        DbEntityEntry<T> Entry<T>(T entity) where T : class;
        int SaveChanges();
        Task<int> SaveChangesAsync();
    }
}
