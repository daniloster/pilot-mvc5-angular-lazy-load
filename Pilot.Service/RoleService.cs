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

namespace Pilot.Service
{
    [UnityIoCPerRequestLifetime]
    public class RoleService : CRUDService<Role>, IRoleService
    {
        private Lazy<IApplicationService> applicationService;
        public IApplicationService ApplicationService { get { return applicationService.Value; } }

        private Lazy<IResourceService> resourceService;
        public IResourceService ResourceService { get { return resourceService.Value; } }

        public RoleService(IEntityContext<Role> db, 
            Lazy<IApplicationService> systemService,
            Lazy<IResourceService> resourceService) 
            : base(db)  {
                this.applicationService = systemService;
                this.resourceService = resourceService;
        }

        public override void Save(Role entity)
        {
            ValidateSave(entity);
            entity.Application = ApplicationService.Get(entity.Application.Id);
            base.Save(entity);
        }

        private void ValidateSave(Role entity)
        {
            entity.Assert<Role>("Name is required.", e => !e.Name.IsNullOrWhiteSpace());
            entity.Assert<Role>("Description is required.", e => !e.Description.IsNullOrWhiteSpace());
            entity.Assert<Role>("System is required.", e => e.Application != null && e.Application.Id > 0);
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
            return Db.DbContext.Roles.Include(p => p.Resources).Include(p => p.Application)
                .Where(p => p.Id == idRole).FirstOrDefault();
        }

        public void CreateAdministratorRole(Application entity)
        {
            Role role = new Role()
            { 
                Id = 0,
                Name = "Administrator",
                Description = string.Format("{0} administrator", entity.Name),
                IsAdmin = true,
                Application = entity
            };
            Save(role);
        }

        public IList<Role> GetRolesByApplication(long idSystem)
        {
            return Db.DbContext.Roles.Where(p => p.Application.Id == idSystem).ToList();
        }

        public IList<Role> GetRolesWithSystem()
        {
            return Db.DbContext.Roles.Include(p => p.Application).ToList();
        }

        public Role GetRoleWithSystem(long id)
        {
            return Db.DbContext.Roles.Include(p => p.Application).Where(p => p.Id == id).FirstOrDefault();
        }

        public IList<Role> GetAvailableRoles(User user, long localSystemId)
        {
            IList<long> idRoles = user.Roles.Select(r => r.Id).ToList();
            IList<long> idApplications = user.Roles.Where(r => r.IsAdmin).Select(r => r.Application.Id).ToList();
            bool motherFuckerAdmin = user.Roles.Any(r => r.IsAdmin && r.Application.Id == localSystemId);

            return Db.DbContext.Roles
                .Include(r => r.Application)
                .Where(r => motherFuckerAdmin || idApplications.Any(idApp => idApp == r.Application.Id))
                .Where(r => !idRoles.Any(idRole => idRole == r.Id))
                .OrderBy(r => r.Name)
                .ToList();
        }

        public IList<Role> GetAssignedRoles(User user, long localSystemId)
        {
            IList<long> idRoles = user.Roles.Select(r => r.Id).ToList();

            return Db.DbContext.Users
                .Include(u => u.Roles)
                .Include(u => u.Roles.Select(r => r.Application))
                .Where(u => u.Id == user.Id)
                .Select(u => u.Roles
                                .Where(p => idRoles.Any(idRole => idRole == p.Id))
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

        public IList<Role> GetByFilter(Role filter, User authorizedUser, long localSystemId)
        {
            filter.Application = filter.Application == null ? new Application() : filter.Application;
            IList<long> idApplications = authorizedUser.Roles.Where(r => r.IsAdmin).Select(r => r.Application.Id).ToList();
            bool motherFuckerAdmin = authorizedUser.Roles.Any(r => r.IsAdmin && r.Application.Id == localSystemId);
            return Db.DbContext.Roles
                .Include(r => r.Application)
                .Where(o => (filter.Application.Id == 0 || o.Application.Id == filter.Application.Id) && (motherFuckerAdmin || idApplications.Any(idApp => idApp == o.Application.Id)))
                .Where(o => filter.Name == null || filter.Name == string.Empty ||
                    o.Name.ToLower().Contains(filter.Name.ToLower())
                    || o.Name.ToLower().StartsWith(filter.Name.ToLower())
                    || o.Name.ToLower().EndsWith(filter.Name.ToLower()))
                .Where(o => filter.Description == null || filter.Description == string.Empty ||
                    o.Description.ToLower().Contains(filter.Description.ToLower())
                    || o.Description.ToLower().StartsWith(filter.Description.ToLower())
                    || o.Description.ToLower().EndsWith(filter.Description.ToLower()))
                .ToList();
        }
    }
}
