using Pilot.Entity;
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
    public interface IResourceService : ICRUDService<Resource>, IDisposable
    {

        Resource GetResourceWithSystem(long idResource);

        IList<Resource> GetResourcesWithSystem();

        IList<Resource> GetResourcesBySystem(long idSystem);

        IList<Resource> GetResourcesAvailable(Role role);

        IList<Resource> GetAssignedResources(Role role);

        int GetTotal();
    }
}
