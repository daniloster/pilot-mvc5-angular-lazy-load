using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pilot.Entity.Domain
{
    public class ResourceType
    {
        public short Id { get; private set; }
        public string Description { get; private set; }

        public static readonly ResourceType Action = new ResourceType() { Id = 1, Description = "Action" };
        public static readonly ResourceType View = new ResourceType() { Id = 2, Description = "View" };
        public static readonly ResourceType Url = new ResourceType() { Id = 3, Description = "URL" };


        public static readonly IList<ResourceType> List = new ResourceType[] { Action, View, Url }.ToArray<ResourceType>();

        public static ResourceType Get(short id)
        {
            for (short idx = 0, len = Convert.ToInt16(ResourceType.List.Count); idx < len; idx++)
            {
                if (ResourceType.List[idx].Id == id)
                {
                    return ResourceType.List[idx];
                }
            }
            return null;
        }
    }
}
