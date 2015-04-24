using Pilot.Database.Security;
using Pilot.Database.Security.Interfaces;
using Pilot.Entity;
using Pilot.Entity.Security;
using Pilot.Service.Security.Interfaces;
using Pilot.Util.Unity;
using Pilot.Util.Unity.Lifetime;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Service.Security
{
    [UnityIoCPerRequestLifetime]
    public partial class CRUDService<TEntity> : ICRUDService<TEntity> where TEntity : class, IBaseEntity
    {
        protected IEntityContext<TEntity> db;

        public CRUDService(IEntityContext<TEntity> db)
        {
            this.db = db;
        }

        public TEntity GetAttachedEntity(TEntity entity, string[] collectionToLoad)
        {
            return db.GetAttachedEntity(entity, collectionToLoad);
        }

        public TEntity GetAttachedEntity(TEntity entity)
        {
            return db.GetAttachedEntity(entity);
        }

        public virtual void Save(TEntity entity)
        {
            db.Save(entity);
        }

        public virtual void Delete(long id)
        {
            db.Delete(id);
        }

        public virtual void Delete(TEntity entity)
        {
            db.Delete(entity);
        }

        public virtual TEntity Get(long id)
        {
            return db.Get(id);
        }

        public virtual IList<TEntity> Get(long[] ids)
        {
            return db.Get(ids);
        }

        public virtual IList<TEntity> Get()
        {
            return db.Get();
        }

        public void Dispose()
        {
            db.Dispose();
            //_unitOfWork.Dispose();
            //UnityEventLogger.Log.DisposeUnityMessage("BusinessClass");
            //if (!_disposed)
            //{
            //    _disposed = true;
            //}
        }
    }
}
