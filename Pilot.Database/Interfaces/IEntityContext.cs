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

        DbRawSqlQuery<T> SqlQuery<T>(string query, params object[] parameters);

        T GetAttachedEntity<T>(T entity) where T : class, IBaseEntity;

        T GetAttachedEntity<T>(T entity, string[] collectionToLoad) where T : class, IBaseEntity;

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
