using Pilot.Database.Security;
using Pilot.Database.Security.Interfaces;
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
        protected IEntityContext<TEntity> Db { get; set; }

        public CRUDService(IEntityContext<TEntity> db)
        {
            this.Db = db;
        }

        public TEntity GetAttachedEntity(TEntity entity, string[] collectionToLoad)
        {
            return Db.GetAttachedEntity(entity, collectionToLoad);
        }

        public TEntity GetAttachedEntity(TEntity entity)
        {
            return Db.GetAttachedEntity(entity);
        }

        public virtual void Save(TEntity entity)
        {
            Db.Save(entity);
        }

        public virtual void Delete(long id)
        {
            Db.Delete(id);
        }

        public virtual void Delete(TEntity entity)
        {
            Db.Delete(entity);
        }

        public virtual TEntity Get(long id)
        {
            return Db.Get(id);
        }

        public virtual IList<TEntity> Get(long[] ids)
        {
            return Db.Get(ids);
        }

        public virtual IList<TEntity> Get()
        {
            return Db.Get();
        }

        public void Dispose()
        {
            Db.Dispose();
            //_unitOfWork.Dispose();
            //UnityEventLogger.Log.DisposeUnityMessage("BusinessClass");
            //if (!_disposed)
            //{
            //    _disposed = true;
            //}
        }
    }
}
