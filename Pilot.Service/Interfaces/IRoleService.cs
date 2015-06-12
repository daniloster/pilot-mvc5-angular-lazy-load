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
    public interface IRoleService : ICRUDService<Role>, IDisposable
    {

        [Transactional]
        void AssignResources(long idRole, long[] idResources);

        Role GetRoleWithResourcesAndSystem(long idRole);

        [Transactional]
        void CreateAdministratorRole(Application entity);

        IList<Role> GetRolesByApplication(long idSystem);

        IList<Role> GetRolesWithSystem();

        Role GetRoleWithSystem(long id);

        IList<Role> GetAssignedRoles(User user, long localSystemId);

        IList<Role> GetRolesAvailable(User user, long localSystemId);

        int GetTotal();

        IList<Role> GetUserRoles(long idUser);

        IList<Role> GetByFilter(Role filter, User authorizedUser, long localSystemId);
    }
}
