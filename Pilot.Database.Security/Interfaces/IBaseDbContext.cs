using Pilot.Entity.Security;
using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Threading.Tasks;
namespace Pilot.Database.Security.Interfaces
{
    public interface IBaseDbContext : IDisposable, IObjectContextAdapter 
    {
        //DbSet<Member> Members { get; }

        DbEntityEntry<T> Entry<T>(T entity) where T : class;
        int SaveChanges();
        Task<int> SaveChangesAsync();
    }
}
