using Pilot.Util.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Pilot.Util.Exceptions
{
    public class JsonException : System.Exception
    {
        public JsonResultView exceptionDetails;

        public JsonException(string message, Exception inner) : base(message, inner) 
        {
            this.exceptionDetails = GetJson(message, inner == null ? string.Empty : inner.StackTrace);
        }

        public JsonException(System.Exception exception) : this(exception.Message, exception) { }

        public JsonException(string message) : this(message, null) { }

        protected JsonException(
        System.Runtime.Serialization.SerializationInfo info,
        System.Runtime.Serialization.StreamingContext context)
            : base(info, context) { }

        public static JsonResultView GetJson(string message, string details)
        {
            return new JsonResultView(new { Message = message, Details = details }, JsonRequestBehavior.AllowGet);
        }

//+		ContentEncoding	null	System.Text.Encoding
//        ContentType	null	string
//+		Data	{ Message = "There is already an application with this name.", Details = "   at DynamicModule.ns.Wrapped_IApplicationService_f0fb7d7925a24add9a9c65b5d9621c53.Save(Application entity)\r\n   at PilotMvc.Controllers.ApplicationController.Save(Application application) in c:\\Users\\Dan\\Documents\\Projects\\pilot-mvc5-angular-lazy-load\\PilotMvc\\Controllers\\ApplicationController.cs:line 30\r\n   at lambda_method(Closure , ControllerBase , Object[] )\r\n   at System.Web.Mvc.ActionMethodDispatcher.Execute(ControllerBase controller, Object[] parameters)\r\n   at System.Web.Mvc.ReflectedActionDescriptor.Execute(ControllerContext controllerContext, IDictionary`2 parameters)\r\n   at System.Web.Mvc.ControllerActionInvoker.InvokeActionMethod(ControllerContext controllerContext, ActionDescriptor actionDescriptor, IDictionary`2 parameters)\r\n   at System.Web.Mvc.Async.AsyncControllerActionInvoker.ActionInvocation.InvokeSynchronousActionMethod()\r\n   at System.Web.Mvc.Async.AsyncControllerActionInvoker.<BeginInvokeSynchronousActionMethod>b__36(IAsyncResult asyncResult, ActionInvocation innerInvokeState)\r\n   at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncResult`2.CallEndDelegate(IAsyncResult asyncResult)\r\n   at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncResultBase`1.End()\r\n   at System.Web.Mvc.Async.AsyncResultWrapper.End[TResult](IAsyncResult asyncResult, Object tag)\r\n   at System.Web.Mvc.Async.AsyncControllerActionInvoker.EndInvokeActionMethod(IAsyncResult asyncResult)\r\n   at System.Web.Mvc.Async.AsyncControllerActionInvoker.AsyncInvocationWithFilters.<InvokeActionMethodFilterAsynchronouslyRecursive>b__3c()\r\n   at System.Web.Mvc.Async.AsyncControllerActionInvoker.AsyncInvocationWithFilters.<>c__DisplayClass45.<InvokeActionMethodFilterAsynchronouslyRecursive>b__3e()\r\n   at System.Web.Mvc.Async.AsyncControllerActionInvoker.<>c__DisplayClass30.<BeginInvokeActionMethodWithFilters>b__2f(IAsyncResult asyncResult)\r\n   at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncResult`1.CallEndDelegate(IAsyncResult asyncResult)\r\n   at System.Web.Mvc.Async.AsyncResultWrapper.WrappedAsyncResultBase`1.End()\r\n   at System.Web.Mvc.Async.AsyncResultWrapper.End[TResult](IAsyncResult asyncResult, Object tag)\r\n   at System.Web.Mvc.Async.AsyncControllerActionInvoker.EndInvokeActionMethodWithFilters(IAsyncResult asyncResult)\r\n   at System.Web.Mvc.Async.AsyncControllerActionInvoker.<>c__DisplayClass1e.<>c__DisplayClass28.<BeginInvokeAction>b__19()\r\n   at System.Web.Mvc.Async.AsyncControllerActionInvoker.<>c__DisplayClass1e.<BeginInvokeAction>b__1b(IAsyncResult asyncResult)" }	<Anonymous Type>
//        JsonRequestBehavior	AllowGet	System.Web.Mvc.JsonRequestBehavior
//        MaxJsonLength	null	int?
//        RecursionLimit	null	int?

    }
}
