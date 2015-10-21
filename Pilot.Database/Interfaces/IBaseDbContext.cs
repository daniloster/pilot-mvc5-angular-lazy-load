using Pilot.Entity;
using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Threading.Tasks;
namespace Pilot.Database.Interfaces
{
    public interface IBaseDbContext : IDisposable, IObjectContextAdapter 
    {
        DbSet<Resource> Resources { get; }
        DbSet<Application> Applications { get; }
        DbSet<Role> Roles { get; }
        DbSet<User> Users { get; }

        System.Data.Entity.Database DataBase { get; }
        DbEntityEntry<T> Entry<T>(T entity) where T : class;
        int SaveChanges();
        Task<int> SaveChangesAsync();
    }
}
