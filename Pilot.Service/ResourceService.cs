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
    public class ResourceService : CRUDService<Resource>, IResourceService
    {
        private Lazy<IApplicationService> systemService;
        public IApplicationService SystemService { get { return systemService.Value; } }

        public ResourceService(IEntityContext<Resource> db, Lazy<IApplicationService> systemService) 
            : base(db)  {
                this.systemService = systemService;
        }

        public override void Save(Resource entity)
        {
            ValidateSave(entity);
            entity.Application = SystemService.Get(entity.Application.Id);
            base.Save(entity);
        }

        private void ValidateSave(Resource entity)
        {
            entity.Assert<Resource>("Resource value is required.", e => !e.Value.IsNullOrWhiteSpace());
            entity.Assert<Resource>("Description is required.", e => !e.Description.IsNullOrWhiteSpace());
            entity.Assert<Resource>("System is required.", e => e.Application != null && e.Application.Id > 0);
        }

        public Resource GetResourceWithSystem(long idResource)
        {
            return Db.DbContext.Resources.Include(p => p.Application)
                .Where(p => p.Id == idResource).FirstOrDefault();
        }

        public IList<Resource> GetResourcesWithSystem()
        {
            return Db.DbContext.Resources.Include(p => p.Application).ToList();
        }

        public IList<Resource> GetResourcesByApplication(long idApplication)
        {
            return Db.DbContext.Resources.Where(o => o.Application.Id == idApplication).ToList();
        }

        public IList<Resource> GetByFilter(Resource filter)
        {
            filter.Application = filter.Application == null ? new Application() : filter.Application;
            return Db.DbContext.Resources
                .Where(o => filter.Application.Id == 0 || o.Application.Id == filter.Application.Id)
                .Where(o => o.ResourceTypeId == filter.ResourceTypeId || filter.ResourceTypeId == 0)
                .Where(o => filter.Value == null || filter.Value == string.Empty ||
                    o.Value.ToLower().Contains(filter.Value.ToLower())
                    || o.Value.ToLower().StartsWith(filter.Value.ToLower())
                    || o.Value.ToLower().EndsWith(filter.Value.ToLower()))
                .Where(o => filter.Description == null || filter.Description == string.Empty ||
                    o.Description.ToLower().Contains(filter.Description.ToLower())
                    || o.Description.ToLower().StartsWith(filter.Description.ToLower())
                    || o.Description.ToLower().EndsWith(filter.Description.ToLower()))
                .ToList();
        }

        public IList<Resource> GetResourcesAvailable(Role role)
        {
            long[] idsSelected = role.Resources.Select(o => o.Id).ToArray();

            return Db.DbContext.Resources
                .Include(o => o.Application)
                .Where(o => o.Application.Id == role.Application.Id && !idsSelected.Any(oaId => oaId == o.Id))
                .OrderBy(o => o.Value)
                .ToList();
        }

        public IList<Resource> GetAssignedResources(Role role)
        {
            return Db.DbContext.Roles
                .Include(p => p.Resources)
                .Include(p => p.Resources.Select(o => o.Application))
                .Where(p => p.Id == role.Id)
                .Select(p => p.Resources.OrderBy(o => o.Value))
                .FirstOrDefault().ToList();
        }

        public int GetTotal()
        {
            return Db.DbContext.Resources.Count();
        }
    }
}
