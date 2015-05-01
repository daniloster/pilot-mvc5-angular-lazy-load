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
    public interface IRoleService : ICRUDService<Role>, IDisposable
    {

        [Transactional]
        void AssignResources(long idRole, long[] idResources);

        Role GetRoleWithResourcesAndSystem(long idRole);

        [Transactional]
        void CreateAdministratorRole(Pilot.Entity.Security.WebSystem entity);

        IList<Role> GetRolesBySystem(long idSystem);

        IList<Role> GetRolesWithSystem();

        Role GetRoleWithSystem(long id);

        IList<Role> GetAssignedRoles(User user, long idSystem);

        IList<Role> GetRolesAvailable(User user, long idSystem);

        int GetTotal();

        IList<Role> GetUserRoles(long idUser);
    }
}
