using Microsoft.Practices.Unity;
using Pilot.Entity;
using Pilot.Service;
using Pilot.Service.Interfaces;
using Pilot.Util.Unity.Lifetime;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace PilotMvc.Controllers
{
    public class MemberController : ApiController
    {
        //public MemberService service = new MemberService();
        [Dependency]
        public IMemberService Service { get; set; }

        public MemberController() { }

        // GET api/member
        public IEnumerable<Member> Get()
        {
            return Service.Get();
        }

        // GET api/member/5
        public Member Get(int id)
        {
            Member member = Service.Get(id);
            if (member == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }
            return member;
        }

        // POST api/member
        public HttpResponseMessage Post(Member member)
        {
            if (ModelState.IsValid)
            {
                Service.Save(member);
                Service.Save(member);
                Service.Save(member);

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, member);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = member.Id }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        // PUT api/member/5
        public HttpResponseMessage Put(int id, Member member)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            if (id != member.Id)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            

            try
            {
                Service.Save(member);
            }
            //catch (DbUpdateConcurrencyException ex)
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK);  
        }

        // DELETE api/member/5
        public HttpResponseMessage Delete(long id)
        {
            Member member = Service.Get(id);
            if (member == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            try
            {
                Service.Delete(member);
            }
            //catch (DbUpdateConcurrencyException ex)
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, member);
        }

        protected override void Dispose(bool disposing)
        {
            Service.Dispose();
            base.Dispose(disposing);
        }
    }
}
