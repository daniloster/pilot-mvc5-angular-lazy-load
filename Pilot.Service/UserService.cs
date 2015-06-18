using Microsoft.Practices.Unity;
using Pilot.Database;
using Pilot.Database.Interfaces;
using Pilot.Entity;
using Pilot.Service.Interfaces;
using Pilot.Util.Exceptions;
using Pilot.Util.Transaction;
using Pilot.Util.Unity;
using Pilot.Util.Unity.Lifetime;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using Pilot.Entity;
using Pilot.Util.Security;
using Pilot.Entity.Domain;

namespace Pilot.Service.Security
{
    [UnityIoCPerRequestLifetime]
    public class UserService : CRUDService<User>, IUserService
    {
        private Lazy<IRoleService> roleService;
        public IRoleService RoleService { get { return roleService.Value; } }

        public UserService(IEntityContext<User> db, Lazy<IRoleService> roleService) 
            : base(db)  {
                this.roleService = roleService;
        }

        public void Register(User entity)
        {
            Validate(entity);

            String password = entity.Password.IsNullOrWhiteSpace() ? Encrypter.CreateRandomPassword(8) : entity.Password;

            entity.UpdatePassword(password);
            base.Save(entity);

            //enviar email
        }

        public override void Save(User entity)
        {
            Validate(entity);
            base.Save(entity);
        }

        private void Validate(User entity)
        {
            entity.Assert<User>("Name is required.", e => !e.Name.IsNullOrWhiteSpace());
            entity.Assert<User>("User name is required.", e => !e.UserName.IsNullOrWhiteSpace());
            entity.Assert<User>("There is already an user with this same user name.", e => !Db.DbContext.Users.Any(u => e.UserName == u.UserName && e.Id != u.Id));
            entity.Assert<User>("There is already an user with this same e-mail.", e => !Db.DbContext.Users.Any(u => e.Email == u.Email && e.Id != u.Id));
        }


        public void AssignRoles(long idUser, long idSystem, long[] idRoles)
        {
            idRoles = idRoles == null ? new long[0] : idRoles;
            idUser.Assert<long>("Invalid user.", id => id != 0);
            idRoles.Assert<long[]>("Invalid role.", ids => !ids.Any(id => id == 0));
            User entity = GetUserWithRoles(idUser);
            entity.Assert<User>("Invalid user.", e => e != null);

            var roles = RoleService.Get(idRoles);
            var removedRoles = entity.Roles.Where(p => p.Application.Id == idSystem && !idRoles.Any(idp => idp == p.Id)).ToList();

            foreach (var role in removedRoles)
            {
                entity.Roles.Remove(role);
            }

            foreach (var role in roles)
            {
                entity.Roles.Add(role);
            }
            
            base.Save(entity);
        }

        public User GetUserWithRoles(long idUser)
        {
            return Db.DbContext.Users
                .Include(u => u.Roles.Select(p => p.Application))
                .Where(u => u.Id == idUser).FirstOrDefault();
        }

        public void UpdatePassword(long id, string password)
        {
            User user = Db.Get(id);
            user.UpdatePassword(password);
            base.Save(user);
        }

        public User Authorize(long idApplication, string userName, string password)
        {
            User user = new User() { UserName = userName };
            user.UpdatePassword(password);

            user = Db.DbContext.Users
                .Include(u => u.Roles.Select(p => p.Application))
                .Include(u => u.Roles.Select(p => p.Resources.Select(o => o.Application)))
                .Where(u => u.UserName == user.UserName && u.Password == user.Password
                    && u.Roles.Any(r => r.Application.Id == idApplication)
                ).FirstOrDefault();

            user.Assert<User>("User name or password is wrong!", u => u != null);

            user.AuthorizedSystemId = idApplication;

            if (user.IsFirstAccess)
            {
                user.IsFirstAccess = false;
                /// Send e-mail to change password here.
                /// Something like www.yourdomain.com/change-password/793hye723d9h8123d28o73degh2y8dg283g27
                ///                www.yourdomain.com/change-password/{token-to-authorize-changing-password}
                base.Save(user);
            }

            return user;
        }

        public int GetTotal()
        {
            return Db.DbContext.Users.Count();
        }

        public User UpdateFlatUser(User user) {
            Validate(user);

            user.Roles = RoleService.GetUserRoles(user.Id);
            user = GetAttachedEntity(user);

            base.Save(user);
            return user;
        }

        public bool HasGrantedAccess(long idSystem, long idUser, string resourceValue)
        {
            return HasGrantedAccess(idSystem, idUser, null, resourceValue);
        }

        public bool HasGrantedAccess(long idSystem, long idUser, short? idResourceType, string resourceValue)
        {
            if (!idResourceType.HasValue)
            {
                idResourceType = ResourceType.RouteUrl.Id;
            }

            bool hasResource = Db.DbContext.Users
                .Any(u => u.Roles.Any(r => r.Application.Id == idSystem && r.Resources
                    .Any(re => idResourceType.Value == re.ResourceTypeId && re.Value == resourceValue))
                );
            
            if (!hasResource)
            {
                return true;
            }

            bool hasAccess = Db.DbContext.Users
                .Any(u => 
                    u.Id == idUser &&
                    u.Roles.Any(r => r.Application.Id == idSystem && 
                        (r.IsAdmin || r.Resources
                            .Any(re => (!idResourceType.HasValue || idResourceType.Value == re.ResourceTypeId) && re.Value == resourceValue)
                        )
                    )
                );

            return hasAccess;
        }

        public IList<User> GetByFilter(User filter, User authorizedUser, long localSystemId)
        {
            return Db.DbContext.Users
                .Where(ws => filter.Name == null || filter.Name == string.Empty
                    || ws.Name.ToLower().Contains(filter.Name.ToLower())
                    || ws.Name.ToLower().StartsWith(filter.Name.ToLower())
                    || ws.Name.ToLower().EndsWith(filter.Name.ToLower()))
                .Where(ws => filter.Email == null || filter.Email == string.Empty
                    || ws.Email.ToLower().Contains(filter.Email.ToLower())
                    || ws.Email.ToLower().StartsWith(filter.Email.ToLower())
                    || ws.Email.ToLower().EndsWith(filter.Email.ToLower()))
                .ToList();
        }

        public IList<User> GetAssignedUsersByRole(Role filter, User authorizedUser, long localSystemId)
        {
            IList<long> idRoles = authorizedUser.Roles.Select(r => r.Id).ToList();
            IList<long> idApplications = authorizedUser.Roles.Where(r => r.IsAdmin).Select(r => r.Application.Id).ToList();
            bool motherFuckerAdmin = authorizedUser.Roles.Any(r => r.IsAdmin && r.Application.Id == localSystemId);
            
            filter.Assert<Role>("You are not allowed to handle this role.", r => motherFuckerAdmin || idApplications.Any(id => id == r.Application.Id) || idRoles.Any(id => id == r.Id));

            return Db.DbContext.Users
                .Include(u => u.Roles)
                .Include(u => u.Roles.Select(r => r.Application))
                .Where(u => u.Roles.Any(r => r.Id == filter.Id))
                .ToList();
        }

        public IList<User> GetAvailableUsers(User authorizedUser, long localSystemId)
        {
            return Db.DbContext.Users
                .Include(u => u.Roles)
                .Include(u => u.Roles.Select(r => r.Application))
                .ToList();
        }
    }
}