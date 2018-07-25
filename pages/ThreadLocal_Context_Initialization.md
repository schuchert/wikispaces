---
title: ThreadLocal_Context_Initialization
---
We have a multi-tiered application where all of the business rules and implemented behind EJBs (session or message-driven). We wrote our own support for single sign-on across roughly 15 applications and that security context is used in a few places:
* The Application Coordination tier for both authentication and authorization
* Business tier for some field-level validation
* Integration tier to track who's doing what

As a result, we end up passing along session keys and security credentials everywhere.

We wanted to minimize passing around these parameters everywhere. We considered the Wormhole pattern but ruled it out as a bit too much for most people to follow (although, in defense of the pattern, I think it's not too bad and it follows a form, so it's repeatable). Instead, we stole from the Wormhole pattern, which makes use of the fact that certain information is stored on ThreadLocal variables, and instead wrapped most of our EJB entry methods to make this information available.

Below you'll find two classes. The first, [Context Recorder]({{site.pagesurl}}/ThreadLocal_Context_Initialization#ContextRecorder), does 3 things.
* Upon the first entry into an EJB Session method, it records the security key and security credentials into a ThreadLocal variable.
* It executes the underlying method.
* It clears out the ThreadLocal variables.

It does not directly interact with ThreadLocal variables. Instead, it uses a class called [Thread Context]({{site.pagesurl}}/ThreadLocal_Context_Initialization#ThreadContext) to both record and clear the thread local variables.

[Thread Context]({{site.pagesurl}}/ThreadLocal_Context_Initialization#ThreadContext) simply creates a thread local variable that is a map. Any code can add to the thread local map and remove from the thread local map.

So if some piece of code needs access to the security credentials or session key, it can simply execute one of the following lines:
```java
   ISessionKey key = (ISessionKey)ThreadContext.get(ThreadContext.SESSION_KEY);
   ISecurityCredentials creds = (ISecurityCredentials)
                         ThreadContext.get(ThreadContext.SECURITY_CREDENTIALS);
```

The ThreadContext class resides in a utility project that does not have direct access to the types ISessionKey or ISecurityCredentials. That's why there's no convenience methods to access those specific types on the interface to ThreadContext.
^
Instead, we created another utility class that simply wrapped ThreadContext and performed the cast for us and put this in the same project where ISessionKey and ISecurityCredentials reside.

----
[#ContextRecorder]({{site.pagesurl}}/#ContextRecorder)
## ContextRecorder.java
```java
01: package com.foo.aspect.context;
02: 
03: import javax.ejb.SessionBean;
04: import com.foo.domain.ISessionKey;
05: import com.foo.coord.to.AbstractTransactionResults;
06: import com.foo.util.thread.ThreadContext;
07: import com.foo.coord.security.local.delegate.ILocalSecuritySession;
08: import com.foo.coord.security.local.delegate.LocalSecuritySessionDelegateFactory;
09: import com.foo.domain.ISecurityCredentials;
10: import com.foo.domain.exception.RequestFailedException;
11: import com.foo.util.exception.UserSessionException;
12: import com.foo.coord.security.local.ejb.TasLocalSecuritySessionBean;
13: import com.foo.coord.security.local.ejb.AsapLocalSecuritySessionBean;
14: import com.foo.coord.security.testsupport.ejb.SecurityTestSupportSessionBean;
15: import com.foo.coord.security.testsupport.ejb.TasSecurityTestSupportSessionBean;
16: 
17: public aspect ContextRecorder
18: {
19: 	pointcut ejbMethod() : 
                execution(AbstractTransactionResults+ SessionBean+.*(..));
20: 	pointcut ejbsToSkip() : 
21: 		execution(* TasLocalSecuritySessionBean+.*(..)) || 
22: 		execution(* AsapLocalSecuritySessionBean+.*(..)) ||
23: 		execution(* SecurityTestSupportSessionBean+.*(..)) ||
24: 		execution(* TasSecurityTestSupportSessionBean+.*(..));
25: 	
26: 	pointcut ejbEntry(SessionBean bean, ISessionKey key) :
27: 		target(bean) &&
28: 		args(key, ..) &&
29: 		ejbMethod() &&
30: 		!cflowbelow(ejbMethod()) &&
31: 		!ejbsToSkip();
32: 	
33: 	
34: 	ISecurityCredentials getSecurityCredentials(ISessionKey key)
35: 		throws RequestFailedException, UserSessionException
36: 	{
37: 		ILocalSecuritySession delegate 
                            LocalSecuritySessionDelegateFactory.getDelegate();
38: 		return delegate.getSecurityCredentials(key);
39: 	}	
40: 	
41: 	Object around(SessionBean bean, ISessionKey key) 
               throws UserSessionException, RequestFailedException : ejbEntry(bean, key)
42: 	{
43: 		try
44: 		{
45: 			ThreadContext.put(ThreadContext.SESSION_KEY, key);
46: 			ThreadContext.put(ThreadContext.SECURITY_CREDENTIALS, 
                                          getSecurityCredentials(key));
47: 		
48: 			return proceed(bean, key);	
49: 		}
50: 		finally
51: 		{
52: 			ThreadContext.clearMap();
53: 		}
54: 	}	
55: }
```

Interesting Lines
^
|--|--|
|Line|Description|
|19|The pointcut ejbMethod matches all methods on SessionBeans or its subclasses.|
|20 - 24|There are a few EJBs that support security. We never want these to be part of this aspect.|
|26|Define the man ponintcut for this aspect.|
|27|The target(receiver of the message) must be a SessionBean or a subclass.|
|28|The first parameter to the method must be ISessionKey, there can be zero or more additional parameters.|
|29|It must be an ejbMethod().|
|30|It must not be in the control flow of the call of ejbMethod. That is, if I'm already executing an ejbMethod() and that calls another ejbMethod, do not do wrap that call as well. It only needs to happen once at the "top" of the EJB call stack.|
|31|Skip the security-related EJB's.|
|45 - 46|Record first the session key and then the security credentials. Note that getting the security credentials might cause a TimedOut exception to be thrown. If this happens, the finally block will remove the already-recorded session key.|
|48|Run the underlying EJB method.|
|52|Regardless of how you are leaving this code, make sure to clean up the ThreadLocal variables. The container probably maintains a thread pool and we don't want to leave trash in our threads.|

----
[#ThreadContext]({{site.pagesurl}}/#ThreadContext)
## ThreadContext.java
```java
01: package com.hertz.common.util.thread;
02: 
03: import java.util.HashMap;
04: import java.util.Map;
05: 
06: public class ThreadContext
07: {
08: 	public static final String SESSION_KEY = "sessionkey";
09: 	public static final String SECURITY_CREDENTIALS = "credentials";
10: 	private static ThreadLocalHashMap map = new ThreadLocalHashMap();
11: 	
12: 	public static HashMap getMap()
13: 	{
14: 		HashMap currentMap = map.getMap();
15: 		if(currentMap == null)
16: 		{
17: 			currentMap = new HashMap();
18: 			map.set(currentMap);
19: 		}
20: 
21: 		return currentMap;
22: 	}
23: 	
24: 	public static void clearMap()
25: 	{
26: 		map.set(null);
27: 	}
28: 	
29: 	public static Object retrieve(Object key)
30: 	{
31: 		return getMap().get(key);
32: 	}
33: 	
34: 	public static Object put(Object key, Object value)
35: 	{
36: 		return getMap().put(key, value);
37: 	}
38: 	
39: 	public static void appendContext(Map map)
40: 	{
41: 		ThreadContext.getMap().putAll(map);
42: 	}
43: }
```
