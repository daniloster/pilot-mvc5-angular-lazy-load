using Pilot.Database.Interfaces;
using Pilot.Entity;
using Pilot.Util.Logging;
using Pilot.Util.Unity.Lifetime;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Database
{
    [UnityIoCTransientLifetime]
    public class EntityContext<TEntity> : IEntityContext<TEntity> where TEntity : class, IBaseEntity
    {
        public IBaseDbContext DbContext { get; set; }

        protected PropertyInfo RepositoryAccess { get; set; }

        public EntityContext(IBaseDbContext dbContext)
        {
            DbContext = dbContext;
            RepositoryAccess = dbContext.GetType().GetProperty(string.Format("{0}s", typeof(TEntity).Name));
        }

        public DbSet<TEntity> Repository
        {
            get { return RepositoryAccess.GetValue(DbContext) as DbSet<TEntity>; }
        }

        protected int SaveChanges()
        {
            try
            {
                return DbContext.SaveChanges();
            }
            catch (System.Data.Entity.Validation.DbEntityValidationException e)
            {
                LoggerFile.AppendLogSafe(e);
                foreach (System.Data.Entity.Validation.DbEntityValidationResult item in e.EntityValidationErrors)
                {
                    foreach (System.Data.Entity.Validation.DbValidationError error in item.ValidationErrors)
                    {
                        LoggerFile.AppendLogSafe(error.ErrorMessage);
                        LoggerFile.AppendLogSafe(error.PropertyName);
                    }
                }
                throw;
            }
        }

        public T GetAttachedEntity<T>(T entity) where T : class, IBaseEntity
        {
            return GetAttachedEntity(entity, new string[0]);
        }
        public T GetAttachedEntity<T>(T entity, string[] collectionToLoad) where T : class, IBaseEntity
        {
            DbEntityEntry<T> entry = DbContext.Entry<T>(entity);

            if (entry.State == EntityState.Detached)
            {
                var set = DbContext.ObjectContext.CreateObjectSet<T>();
                T attachedEntity = set.SingleOrDefault(e => e.Id == entity.Id);  // You need to have access to key
                if (attachedEntity != null)
                {
                    var attachedEntry = DbContext.Entry(attachedEntity);
                    attachedEntry.CurrentValues.SetValues(entity);
                    collectionToLoad.All(prop => { attachedEntry.Collection(prop).Load(); return true; });
                    return attachedEntry.Entity;
                }
            }

            return entity;
        }

        public virtual void Save(TEntity entity)
        {
            if (entity.Id > 0)
            {
                DbEntityEntry<TEntity> entry = DbContext.Entry<TEntity>(entity);

                if (entry.State == EntityState.Detached)
                {
                    var set = DbContext.ObjectContext.CreateObjectSet<TEntity>();
                    TEntity attachedEntity = set.SingleOrDefault(e => e.Id == entity.Id);  // You need to have access to key
                    if (attachedEntity != null)
                    {
                        var attachedEntry = DbContext.Entry(attachedEntity);
                        attachedEntry.CurrentValues.SetValues(entity);
                    }
                    else
                    {
                        entry.State = EntityState.Modified; // This should attach entity
                    }
                }
                else
                {
                    entry.State = EntityState.Modified; // This should attach entity
                }
            }
            else
            {
                this.DbContext.ObjectContext.CreateObjectSet<TEntity>().AddObject(entity);
            }
            SaveChanges();
        }

        public virtual void Delete(long id)
        {
            this.Delete(Get(id));
            SaveChanges();
        }

        public virtual void Delete(TEntity entity)
        {
            this.DbContext.ObjectContext.CreateObjectSet<TEntity>().DeleteObject(entity);
            SaveChanges();
        }

        public virtual TEntity Get(long id)
        {
            return this.DbContext.ObjectContext.CreateObjectSet<TEntity>().Where(et => et.Id == id).SingleOrDefault<TEntity>();  
        }

        public virtual IList<TEntity> Get()
        {
            return new List<TEntity>(this.DbContext.ObjectContext.CreateObjectSet<TEntity>().AsEnumerable()); 
        }

        public virtual IList<TEntity> Get(long[] ids)
        {
            return new List<TEntity>(this.DbContext.ObjectContext.CreateObjectSet<TEntity>().Where(e => ids.Contains(e.Id)).AsEnumerable());
        }

        public virtual IQueryable<TEntity> AsQueryableTyped()
        {
            return this.DbContext.ObjectContext.CreateObjectSet<TEntity>().AsQueryable<TEntity>();
        }

        public virtual IQueryable AsQueryable()
        {
            return this.DbContext.ObjectContext.CreateObjectSet<TEntity>().AsQueryable();
        }

        public void Dispose()
        {
            DbContext.Dispose();
        }
    }  
}
