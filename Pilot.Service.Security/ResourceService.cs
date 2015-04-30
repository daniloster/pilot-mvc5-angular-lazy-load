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
    public class resourceService : CRUDService<Resource>, IResourceService
    {
        private Lazy<ISystemService> systemService;
        public ISystemService SystemService { get { return systemService.Value; } }

        public resourceService(IEntityContext<Resource> db, Lazy<ISystemService> systemService) 
            : base(db)  {
                this.systemService = systemService;
        }

        public override void Save(Resource entity)
        {
            ValidateSave(entity);
            entity.System = SystemService.Get(entity.System.Id);
            base.Save(entity);
        }

        private void ValidateSave(Resource entity)
        {
            entity.Assert<Resource>("Resource value is required.", e => !e.Value.IsNullOrWhiteSpace());
            entity.Assert<Resource>("Description is required.", e => !e.Description.IsNullOrWhiteSpace());
            entity.Assert<Resource>("System is required.", e => e.System != null && e.System.Id > 0);
        }

        public Resource GetResourceWithSystem(long idResource)
        {
            return Db.DbContext.Resources.Include(p => p.System)
                .Where(p => p.Id == idResource).FirstOrDefault();
        }

        public IList<Resource> GetResourcesWithSystem()
        {
            return Db.DbContext.Resources.Include(p => p.System).ToList();
        }

        public IList<Resource> GetResourcesBySystem(long id)
        {
            return Db.DbContext.Resources.Where(o => o.System.Id == id).ToList();
        }

        public IList<Resource> GetResourcesAvailable(Role role)
        {
            long[] idsSelected = role.Resources.Select(o => o.Id).ToArray();

            return Db.DbContext.Resources
                .Include(o => o.System)
                .Where(o => o.System.Id == role.System.Id && !idsSelected.Any(oaId => oaId == o.Id))
                .OrderBy(o => o.Value)
                .ToList();
        }

        public IList<Resource> GetAssignedResources(Role role)
        {
            return Db.DbContext.Roles
                .Include(p => p.Resources)
                .Include(p => p.Resources.Select(o => o.System))
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
