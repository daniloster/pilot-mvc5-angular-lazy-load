using Pilot.Entity.Security;
using Pilot.Util.Transaction;
using Pilot.Util.Unity.Lifetime;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Service.Security.Interfaces
{
    public interface ISystemService : ICRUDService<Pilot.Entity.Security.WebSystem>, IDisposable
    {
        [Transactional]
        void Create(Pilot.Entity.Security.WebSystem entity);

        int GetTotal();

        IList<WebSystem> GetByFilter(WebSystem system);
    }
}
