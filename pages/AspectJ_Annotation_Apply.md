---
title: AspectJ_Annotation_Apply
---
[[AspectJ Annotation AllCode|<--Back]] [[AspectJ Annotation Start|Next-->]]

# Apply

## Do Not Ignore
Add a second set of around advice to FieldSetAspect.java. This around advice should only apply to fields that implement @IgnoreField. Simply report that changes to this field are ignored.

**Challenge:** Only report the first time a field is accessed. After that, silently ignore fields with @IgnoreField on them.
----
## EJB 3
The EJB 3 specification uses annotations to describe Enterprise Beans. For examples, review this article [Getting Started with EJB 3.0 and Enterprise Bean Components](http://www.devx.com/Java/Article/30045). [Page 2](http://www.devx.com/Java/Article/30045/0/page/2) shows examples of what it takes to create a stateless bean.

Describe how you might use annotations taking into consideration the way EJB 3.0 works.
----
## Research
Research the work required to implement one of the first five options described on [[AspectJ Annotation Possibilities]], or one of your own invention.

Compare and contrast that solution with the one described on [[AspectJ Annotation One Solution]].

**Challenge:** Implement your solution
----
## Advanced: Mixing CFlow and Annotations
If you have not already done so, work through [[AspectJ CFlow|CFlow Example]].

Create a new annotation, @IgnoreMethod, that works just like @IgnoreField. Only this time, all changes are ignored if they happen either directly in this method or the cflow of this method.

[[AspectJ Annotation AllCode|<--Back]] [[AspectJ Annotation Start|Next-->]]