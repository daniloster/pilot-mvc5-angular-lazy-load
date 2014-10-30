using Pilot.Entity;
using Pilot.Util.Transaction;
using Pilot.Util.Unity.Lifetime;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Service.Interfaces
{
    public interface ICRUDService<TEntity> : IDisposable where TEntity : class, IBaseEntity
    {
        [Transactional]
        void Save(TEntity entity);

        [Transactional]
        void Delete(long id);

        [Transactional]
        void Delete(TEntity entity);

        TEntity Get(long id);

        IList<TEntity> Get();
    }
}
