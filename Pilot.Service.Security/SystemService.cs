using Microsoft.Practices.Unity;
using Pilot.Database.Security;
using Pilot.Database.Security.Interfaces;
using Pilot.Entity.Security;
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
    public class systemService : CRUDService<Pilot.Entity.Security.WebSystem>, ISystemService
    {
        private Lazy<IRoleService> roleService;
        private Lazy<IResourceService> resourceService;
        public IRoleService RoleService { get { return roleService.Value; } }
        public IResourceService ResourceService { get { return resourceService.Value; } }

        public systemService(IEntityContext<Pilot.Entity.Security.WebSystem> db, Lazy<IRoleService> roleService, Lazy<IResourceService> resourceService) 
            : base(db)  {
                this.roleService = roleService;
                this.resourceService = resourceService;
            }

        public override void Save(Pilot.Entity.Security.WebSystem entity)
        {
            ValidateSave(entity);
            base.Save(entity);
        }

        public void Create(Pilot.Entity.Security.WebSystem entity)
        {
            Save(entity);
            RoleService.CreateAdministratorRole(entity);
        }

        public override void Delete(long id)
        {
            IList<Resource> resources = ResourceService.GetResourcesBySystem(id);

            foreach (Resource resource in resources)
            {
                ResourceService.Delete(resource);
            }

            IList<Role> roles = RoleService.GetRolesBySystem(id);

            foreach (Role role in roles)
            {
                RoleService.Delete(role);
            }

            base.Delete(id);
        }

        private void ValidateSave(Pilot.Entity.Security.WebSystem entity)
        {
            entity.Assert<Pilot.Entity.Security.WebSystem>("Name is required.", e => !e.Name.IsNullOrWhiteSpace());
            entity.Assert<Pilot.Entity.Security.WebSystem>("Description is required.", e => !e.Description.IsNullOrWhiteSpace());
            entity.Assert<Pilot.Entity.Security.WebSystem>("There is already a system with this name.", e => !Db.DbContext.WebSystems.Any(s => s.Name == e.Name && s.Id != e.Id));
        }

        public int GetTotal()
        {
            return Db.DbContext.WebSystems.Count();
        }

        public IList<WebSystem> GetByFilter(WebSystem system)
        {
            return Db.DbContext.WebSystems
                .Where(ws => system.Name.IsNullOrWhiteSpace()
                    || ws.Name.ToLower().Contains(system.Name.ToLower())
                    || ws.Name.ToLower().StartsWith(system.Name.ToLower())
                    || ws.Name.ToLower().EndsWith(system.Name.ToLower()))
                .Where(ws => system.Description.IsNullOrWhiteSpace()
                    || ws.Description.ToLower().Contains(system.Description.ToLower())
                    || ws.Description.ToLower().StartsWith(system.Description.ToLower())
                    || ws.Description.ToLower().EndsWith(system.Description.ToLower()))
                .ToList();
        }

        public void Dispose() 
        {
            this.ResourceService.Dispose();
            this.RoleService.Dispose();
        }
    }
}
