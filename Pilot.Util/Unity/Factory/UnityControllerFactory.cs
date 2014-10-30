using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Microsoft.Practices.Unity;

namespace Pilot.Util.Unity.Factory
{
    public class UnityControllerFactory : DefaultControllerFactory
    {
        protected override IController GetControllerInstance(RequestContext reqContext, Type controllerType)
        {
            IController controller;

            if (controllerType == null)
                throw new HttpException(404, String.Format("The controller for path '{0}' could not be found" + "or it does not implement IController.", reqContext.HttpContext.Request.Path));

            if (!typeof(IController).IsAssignableFrom(controllerType))
                throw new ArgumentException(string.Format("Type requested is not a controller: {0}", controllerType.Name), "controllerType");

            try
            {
                controller = MvcUnityContainer.Container.Resolve(controllerType) as IController;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException(String.Format("Error resolving controller {0}", controllerType.Name), ex);
            }

            return controller;
        }
    }
}
