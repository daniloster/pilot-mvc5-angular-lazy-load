using Pilot.Database.Interfaces;
using Pilot.Entity;
using Pilot.Util.Unity.Lifetime;
using System;
using System.Collections.Generic;
using System.Data.Entity;
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
            return DbContext.SaveChanges();
        }

        public virtual void Save(TEntity entity)
        {
            if (entity.Id > 0)
            {
                DbContext.Entry<TEntity>(entity).State = EntityState.Modified;
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
