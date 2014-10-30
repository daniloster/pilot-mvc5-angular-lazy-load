using Microsoft.Practices.Unity.InterceptionExtension;
using Pilot.Util.Transaction;
using Pilot.Util.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using Microsoft.Practices.Unity;

namespace Pilot.Util.Transaction
{
    public class TransactionBehaviour : IInterceptionBehavior
    {
        public TransactionBehaviour() { }

        public IEnumerable<Type> GetRequiredInterfaces()
        {
            return Type.EmptyTypes;
        }

        public IMethodReturn Invoke(IMethodInvocation input, GetNextInterceptionBehaviorDelegate getNext)
        {
            IMethodReturn methodReturn;
            bool isTransaction = input.MethodBase.GetCustomAttributes(typeof(TransactionalAttribute), true).Length > 0;
            if (isTransaction)
            {
                DiagnosisEvents.Log.MethodEnter(string.Format(" [@ {0} Transactional Call]", typeof(TransactionBehaviour).Name));
                using (var scope = new TransactionScope(TransactionScopeOption.Required, new TransactionOptions { IsolationLevel = IsolationLevel.Serializable }))
                {
                    methodReturn = getNext().Invoke(input, getNext);
                    if (methodReturn.Exception == null)
                    {
                        scope.Complete();
                        DiagnosisEvents.Log.MethodLeave(string.Format(" [@ {0} Transactional Call: Succeeded]", typeof(TransactionBehaviour).Name));
                    }
                    else
                    {
                        DiagnosisEvents.Log.MethodLeave(string.Format(" [@ {0} Transactional Call: Error \"{1}\" - \"{2}\"]", typeof(TransactionBehaviour).Name, methodReturn.Exception.GetType().Name, methodReturn.Exception.Message));
                    }
                }
            }
            else
            {
                methodReturn = getNext().Invoke(input, getNext);
            }

            return methodReturn;
        }

        public bool WillExecute
        {
            get { return true; }
        }
    }
}
