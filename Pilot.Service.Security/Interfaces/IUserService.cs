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
    public interface IUserService : ICRUDService<User>, IDisposable
    {
        [Transactional]
        void Register(User entity);

        [Transactional]
        void AssignRoles(long idUser, long idSystem, long[] idRoles);

        User GetUserWithRoles(long idUser);

        [Transactional]
        void UpdatePassword(long id, string password);

        User Authorize(string userName, string password);

        int GetTotal();

        [Transactional]
        User UpdateFlatUser(User user);
    }
}
