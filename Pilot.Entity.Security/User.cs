using Pilot.Util.Security;
using Pilot.Util.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Pilot.Entity;
using Newtonsoft.Json;
using Pilot.Entity.Security.Domain;

namespace Pilot.Entity.Security
{
    public class User : BaseEntity
    {
        private const string USER_KEYWORD = "ChickenLittle";

        [Required]
        public string UserName { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        [ScriptIgnore(ApplyToOverrides=true)]
        [JsonIgnore]
        public string Password { get; set; }
        [Required]
        public string Name { get; set; }

        public bool IsFirstAccess { get; set; }

        [Editable(false)]
        [ScriptIgnore(ApplyToOverrides = true)]
        [JsonIgnore]
        public virtual IList<Role> Roles { get; set; }

        [NotMapped]
        [ScriptIgnore(ApplyToOverrides = true)]
        [JsonIgnore]
        public virtual long AuthorizedSystemId { get; set; }


        [NotMapped]
        public IList<Resource> ActionResources
        {
            get
            {
                List<Resource> resources = new List<Resource>();
                foreach (Role role in Roles)
                {
                    resources.AddRange(role.Resources.Where(r => r.System.Id == AuthorizedSystemId && r.ResourceTypeId == ResourceType.Action.Id).ToList());
                }
                return resources;
            }
        }

        [NotMapped]
        public IList<Resource> ViewResources
        {
            get
            {
                List<Resource> resources = new List<Resource>();
                foreach (Role role in Roles)
                {
                    resources.AddRange(role.Resources.Where(r => r.System.Id == AuthorizedSystemId && r.ResourceTypeId == ResourceType.View.Id).ToList());
                }
                return resources;
            }
        }

        [NotMapped]
        [ScriptIgnore(ApplyToOverrides = true)]
        [JsonIgnore]
        public IList<Resource> UrlResources
        {
            get
            {
                List<Resource> resources = new List<Resource>();
                foreach (Role role in Roles)
                {
                    resources.AddRange(role.Resources.Where(r => r.System.Id == AuthorizedSystemId && r.ResourceTypeId == ResourceType.Url.Id).ToList());
                }
                return resources;
            }
        }

        public User() 
        {
            IsFirstAccess = true;
            Roles = new List<Role>();
        }
        
        public void UpdatePassword(string password)
        {
            this.Assert<User>("User name is required to update the password.",
                user => !user.UserName.IsNullOrWhiteSpace());

            Password = Encrypter.Encrypt(USER_KEYWORD, UserName, password);
        }
    }
}
