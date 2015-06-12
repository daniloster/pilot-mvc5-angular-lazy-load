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
    public interface IApplicationService : ICRUDService<Application>, IDisposable
    {
        int GetTotal();

        IList<Application> GetByFilter(Application system, User authorizedUser, long localSystemId);

        IList<Application> GetAvailableAppsByUser(User authorizedUser, long localSystemId);
    }
}
