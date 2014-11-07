using Pilot.Entity;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Database.Interfaces
{
    public interface IEntityContext<TEntity> where TEntity : class, IBaseEntity
    {
        IBaseDbContext DbContext { get; }

        DbSet<TEntity> Repository { get; }

        TEntity GetAttachedEntity(TEntity entity);

        TEntity GetAttachedEntity(TEntity entity, string[] collectionToLoad);

        void Save(TEntity entity);

        void Delete(long id);

        void Delete(TEntity entity);

        TEntity Get(long id);

        IList<TEntity> Get(long[] ids);

        IList<TEntity> Get();

        IQueryable<TEntity> AsQueryableTyped();

        IQueryable AsQueryable();

        void Dispose();
    }
}
