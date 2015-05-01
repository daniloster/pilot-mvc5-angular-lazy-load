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

namespace Pilot.Service.Security
{
    [UnityIoCPerRequestLifetime]
    public class RoleService : CRUDService<Role>, IRoleService
    {
        private Lazy<ISystemService> systemService;
        public ISystemService SystemService { get { return systemService.Value; } }

        private Lazy<IResourceService> resourceService;
        public IResourceService ResourceService { get { return resourceService.Value; } }

        public RoleService(IEntityContext<Role> db, 
            Lazy<ISystemService> systemService,
            Lazy<IResourceService> resourceService) 
            : base(db)  {
                this.systemService = systemService;
                this.resourceService = resourceService;
        }

        public override void Save(Role entity)
        {
            ValidateSave(entity);
            entity.System = SystemService.Get(entity.System.Id);
            base.Save(entity);
        }

        private void ValidateSave(Role entity)
        {
            entity.Assert<Role>("Name is required.", e => !e.Name.IsNullOrWhiteSpace());
            entity.Assert<Role>("Description is required.", e => !e.Description.IsNullOrWhiteSpace());
            entity.Assert<Role>("System is required.", e => e.System != null && e.System.Id > 0);
        }

        public void AssignResources(long idRole, long[] idResources)
        {
            idResources = idResources == null ? new long[0] : idResources;
            idRole.Assert<long>("Invalid role.", id => id != 0);
            idResources.Assert<long[]>("There is an invalid resource.", ids => !ids.Any(id => id == 0));
            Role entity = GetRoleWithResourcesAndSystem(idRole);
            entity.Assert<Role>("Perfil inválido.", e => e != null);
            entity.Resources.Clear();

            foreach (var id in idResources)
            {
                var objeto = ResourceService.GetResourceWithSystem(id);
                entity.Resources.Add(objeto);
            }

            base.Save(entity);
        }

        public Role GetRoleWithResourcesAndSystem(long idRole)
        {
            return Db.DbContext.Roles.Include(p => p.Resources).Include(p => p.System)
                .Where(p => p.Id == idRole).FirstOrDefault();
        }

        public void CreateAdministratorRole(Pilot.Entity.Security.WebSystem entity)
        {
            Role role = new Role()
            { 
                Id = 0,
                Name = "Administrator",
                Description = string.Format("{0} administrator", entity.Name),
                IsAdmin = true,
                System = entity
            };
            Save(role);
        }

        public IList<Role> GetRolesBySystem(long idSystem)
        {
            return Db.DbContext.Roles.Where(p => p.System.Id == idSystem).ToList();
        }

        public IList<Role> GetRolesWithSystem()
        {
            return Db.DbContext.Roles.Include(p => p.System).ToList();
        }

        public Role GetRoleWithSystem(long id)
        {
            return Db.DbContext.Roles.Include(p => p.System).Where(p => p.Id == id).FirstOrDefault();
        }

        public IList<Role> GetRolesAvailable(User user, long idSystem)
        {
            long[] idsSelected = user.Roles.Select(p => p.Id).ToArray();

            return Db.DbContext.Roles
                .Where(p => p.System.Id == idSystem)
                .Where(p => !idsSelected.Any(paId => paId == p.Id))
                .OrderBy(p => p.Name)
                .ToList();
        }

        public IList<Role> GetAssignedRoles(User user, long idSystem)
        {
            return Db.DbContext.Users
                .Include(u => u.Roles)
                .Where(u => u.Id == user.Id)
                .Select(u => u.Roles
                                .Where(p => p.System.Id == idSystem)
                                .OrderBy(p => p.Name).ToList())
                .FirstOrDefault();
        }

        public int GetTotal()
        {
            return base.Get().Count();
        }

        public IList<Role> GetUserRoles(long idUser) 
        {
            return Db.DbContext.Users
                .Where(u => u.Id == idUser)
                .Select(u => u.Roles)
                .FirstOrDefault();
        }
    }
}
