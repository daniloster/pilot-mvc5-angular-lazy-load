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
    public interface IUserService : ICRUDService<User>, IDisposable
    {
        [Transactional]
        void Register(User entity);

        [Transactional]
        void AssignRoles(long idUser, long idSystem, long[] idRoles);

        User GetUserWithRoles(long idUser);

        [Transactional]
        void UpdatePassword(long id, string password);

        User Authorize(long idApplication, string userName, string password);

        int GetTotal();

        [Transactional]
        User UpdateFlatUser(User user);

        bool HasGrantedAccess(long idSystem, long idUser, string resourceValue);

        bool HasGrantedAccess(long idSystem, long idUser, short? idResourceType, string resourceValue);

        IList<User> GetByFilter(User filter, User authorizedUser, long localSystemId);
    }
}
