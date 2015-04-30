using Microsoft.Practices.Unity;
using Pilot.Database.Security;
using Pilot.Database.Security.Interfaces;
using Pilot.Entity;
using Pilot.Service.Security.Interfaces;
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
using Pilot.Entity.Security;
using Pilot.Util.Security;

namespace Pilot.Service.Security
{
    [UnityIoCPerRequestLifetime]
    public class UsuarioService : CRUDService<User>, IUserService
    {
        private Lazy<IRoleService> roleService;
        public IRoleService RoleService { get { return roleService.Value; } }

        public UsuarioService(IEntityContext<User> db, Lazy<IRoleService> roleService) 
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
            var removedRoles = entity.Roles.Where(p => p.System.Id == idSystem && !idRoles.Any(idp => idp == p.Id)).ToList();

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
                .Include(u => u.Roles.Select(p => p.System))
                .Where(u => u.Id == idUser).FirstOrDefault();
        }

        public void UpdatePassword(long id, string password)
        {
            User user = Db.Get(id);
            user.UpdatePassword(password);
            base.Save(user);
        }


        public User Authorize(string userName, string password)
        {
            User user = new User() { UserName = userName };
            user.UpdatePassword(password);

            user =  Db.DbContext.Users
                .Include(u => u.Roles.Select(p => p.System))
                .Include(u => u.Roles.Select(p => p.Resources.Select(o => o.System)))
                .Where(u => u.UserName == user.UserName && u.Password == user.Password).FirstOrDefault();

            user.Assert<User>("User name/password wrong!", u => u != null);

            if (user.IsFirstAccess) {
                user.IsFirstAccess = false;
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
    }
}