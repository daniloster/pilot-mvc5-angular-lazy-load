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
    public class ApplicationService : CRUDService<Application>, IApplicationService
    {
        private Lazy<IRoleService> roleService;
        public IRoleService RoleService { get { return roleService.Value; } }

        private Lazy<IResourceService> resourceService;
        public IResourceService ResourceService { get { return resourceService.Value; } }

        public ApplicationService(IEntityContext<Application> db, Lazy<IRoleService> roleService, Lazy<IResourceService> resourceService) 
            : base(db)  {
                this.roleService = roleService;
                this.resourceService = resourceService;
            }

        public override void Save(Application entity)
        {
            bool mustCreateAdminRole = entity.Id == 0;
            ValidateSave(entity);
            base.Save(entity);
            if (mustCreateAdminRole)
            {
                RoleService.CreateAdministratorRole(entity);
            }
        }

        public override void Delete(long id)
        {
            IList<Resource> resources = ResourceService.GetResourcesByApplication(id);

            foreach (Resource resource in resources)
            {
                ResourceService.Delete(resource);
            }

            IList<Role> roles = RoleService.GetRolesByApplication(id);

            foreach (Role role in roles)
            {
                RoleService.Delete(role);
            }

            base.Delete(id);
        }

        private void ValidateSave(Application entity)
        {
            entity.Assert<Application>("Name is required.", e => !e.Name.IsNullOrWhiteSpace());
            entity.Assert<Application>("Description is required.", e => !e.Description.IsNullOrWhiteSpace());
            entity.Assert<Application>("There is already an application with this name.", e => !Db.DbContext.Applications.Any(s => s.Name == e.Name && s.Id != e.Id));
        }

        public int GetTotal()
        {
            return Db.DbContext.Applications.Count();
        }

        public IList<Application> GetByFilter(Application application)
        {
            return Db.DbContext.Applications
                .Where(ws => application.Name == null || application.Name == string.Empty
                    || ws.Name.ToLower().Contains(application.Name.ToLower())
                    || ws.Name.ToLower().StartsWith(application.Name.ToLower())
                    || ws.Name.ToLower().EndsWith(application.Name.ToLower()))
                .Where(ws => application.Description == null || application.Description == string.Empty
                    || ws.Description.ToLower().Contains(application.Description.ToLower())
                    || ws.Description.ToLower().StartsWith(application.Description.ToLower())
                    || ws.Description.ToLower().EndsWith(application.Description.ToLower()))
                .ToList();
        }

        public void Dispose() 
        {
            this.ResourceService.Dispose();
            this.RoleService.Dispose();
        }
    }
}
