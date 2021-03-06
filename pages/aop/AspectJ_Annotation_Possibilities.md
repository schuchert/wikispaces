---
title: AspectJ_Annotation_Possibilities
---
{% include nav prev="AspectJ_Annotation_Problem" next="AspectJ_Annotation_One_Solution" %}

## Possibilities
What ideas did you come up with? How about some of these ideas:
* Use a super class to contain fields that don’t affect change tracking. Inherit and only capture the setters on fields in the derived class.
* Use the modifier transient. Somehow skip fields that are transient.
* Write anther aspect. When you are about to set a field that you want to ignore, the aspect captures the set, stores the current change state, allows the other aspect to proceed, then restores the changed state after the change.
* Use some kind of naming convention. Fields that match the naming convention (e.g. prepending an underscore, _ , or something similar) are not considered for change tracking.
* Manually modify the aspect to skip specific fields in specific classes.
* Use an annotation to denote fields we want to skip. Then change the aspect to ignore those fields so annotated.
* ...

### Option 1 – Inheritance
We are using option 1 right now. All of our “changed-tracked” classes have an interface, ITrackedObject and a base class, TrackedObjectMixin, introduced. We have written the pointcut to ignore fields in TrackedObjectMixin to avoid infinite recursion. This is OK for that solution because there’s only one class and one field. As a general technique, however, it seems unnecessarily complex.

Note that if we take this approach, our classes are aware of the aspect. We have to implement them in a particular way to get the aspect to ignore them.

### Option 2 – Transient
We can do this. However, we are coupling two concepts together. If I serialize an object, it will lose its transient fields (by default) and that might not be what I want. So while we can make this "work", it is unnecessarily limiting.

Note also that like option 1, our classes are aware of the aspect where they previously were not.

### Option 3 – Second Aspect
First we would have to learn about aspect precedence. Second, while this work is fairly light-weight, we are basically doing work we intend to ignore. Not a good idea in general. Finally, it seems fairly complex.

On a positive note, this solution does not require our “normal” or non-aspect code to be aware of the aspect code. On the other hand, for a large system, the pointcut to describe the fields to skip will grow quite large.

### Option 4 – Naming Conventions
Not a bad solution. So long as we convey the naming convention things should work alright. However, like option 2, this messes some things up. There’s a common utility called the Commons Beanutils. It's a very handy library for working with Java Beans. If you use this, you must follow the java-beans "design" conventions. So field names need to match method names. If they do not, you cannot use the Beanutils. You might get away with creating a beaninfo object, but this then becomes complex. 

So we end up with a working solution but the getter and setter method names should probably follow the name of the field and we might end up with an interface that seems a bit off. 

This problem unnecessarily couples two ideas together. But of the solutions so far, it is probably the best.

This option does make our non-aspect code aware of the aspect code in the sense that we are changing its design to skip certain fields.

### Option 5 – Case by Case on Pointcut
This keeps all of the knowledge in one place, the aspect. However, for any large system, this will make the pointcut quite complex. This option is a lot like option 3, just a whole lot easier that having 2 aspects.

This solution keeps the non-aspect code oblivious of the aspect code.

### Option 6 – Annotations
This solution is similar to the naming convention idea but it has no other connotations (besides using Java 5). It is straightforward, should be easy to implement and follow.

It does make non-aspect code aware of the aspect design.

### Option 7 - Your Ideas
What were your ideas? I'd like to hear them. I'll add them and credit you (with your permission). Email me: schuchert@yahoo.com.

{% include nav prev="AspectJ_Annotation_Problem" next="AspectJ_Annotation_One_Solution" %}
