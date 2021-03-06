---
title: AspectJEX3Explained
---
{% include nav prev="AspectJEX3SoWhatIsHappening" next="AspectJEX3ApplyYourself" %}

## Example 3 Explained
In addition to modifying such things as method exeuction and method calling and attribute reading and writing, we can also use introductions. The introduction in this example simply adds the Serializable interface to a class that did not already implement it. Imagin wanting to use some legay code that does not support some interface or feature. This is one way to can get that legacy code to support new functionality without changing its souce code.

Remember that when we’re working with AOP, we have to consider “what” and “where”.  For this example:
* **What:** Add an interface to an existing class.
* **Where:** One class in particular, but whereever we want to.

To make this example work, we need two additional things:
* SerializableIntroductionAspect.java
* aop.xml

----
### SerializableIntroductionAspect.java
{% highlight java %}
01: package ex3;
02: 
03: import java.io.Serializable;
04: 
05: import org.aspectj.lang.annotation.Aspect;
06: import org.aspectj.lang.annotation.DeclareParents;
07: 
08: @Aspect
09: public class SerializableIntroductionAspect {
10:     @DeclareParents(value="ex3.Die")
11:     Serializable serializable;
12: }
{% endhighlight %}
#### Interesting Lines
^
|-|-|
|Line|Description|
|8|As we have seen with other examples, we denote this class as an apsect. Using annotations we are able to use AspectJ without a special compiler by using the @Aspect syntax.|
|10|We use the @DeclareParents annotation to modify the next line. What is in the ("") is the class being targeted. The next line defined a field (instance variable). The net effect is that we add the type on the next line as an interface that the class on line 10 will now implement.|
|11|Define an instance variable for this class/aspect. Becuase this line is annotated with @DeclareParents, the type of this variable is added as an interface to the ex3.Die class.|

### aop.xml
{% highlight xml %}
01: <aspectj>
02: 	<aspects>
03: 		<aspect name="ex3.SerializableIntroductionAspect"/>
04: 	</aspects>
05: 	<weaver>
06: 		<include within="ex3.*"/>
07: 	</weaver>
08: </aspectj>
{% endhighlight %}

#### Interesting Lines
^
|-|-|
|Line|Description|
|3|List the aspect we want to weave into our code|
|6|Apply the aspect to all classes in the package ex3|

### Main.java
{% highlight java %}
01: package ex3;
02: 
03: import java.io.ByteArrayInputStream;
04: import java.io.ByteArrayOutputStream;
05: import java.io.Closeable;
06: import java.io.IOException;
07: import java.io.ObjectInputStream;
08: import java.io.ObjectOutputStream;
09: 
10: public class Main {
11:     public static void main(String[] args) throws IOException,
12:             ClassNotFoundException {
13:         Die d = new Die();
14:         int faceValue = d.getFaceValue();
15: 
16:         ByteArrayOutputStream baos = serializeObject(d);
17:         Die retrievedDie = deserializeObject(baos);
18: 
19:         if (retrievedDie.getFaceValue() != faceValue) {
20:             System.out.printf("Expected %d, but found %d\n", faceValue,
21:                     retrievedDie.getFaceValue());
22:         } else {
23:             System.out.printf("Serialization successful\n");
24:         }
25: 
26:     }
27: 
28:     private static ByteArrayOutputStream serializeObject(Die d)
29:             throws IOException {
30:         ByteArrayOutputStream baos = null;
31:         ObjectOutputStream oos = null;
32: 
33:         try {
34:             baos = new ByteArrayOutputStream(1024);
35:             oos = new ObjectOutputStream(baos);
36:             oos.writeObject(d);
37:         } finally {
38:             close(oos);
39:             close(baos);
40:         }
41: 
42:         return baos;
43:     }
44: 
45:     private static Die deserializeObject(ByteArrayOutputStream baos)
46:             throws IOException, ClassNotFoundException {
47:         ByteArrayInputStream bais = null;
48:         ObjectInputStream ois = null;
49: 
50:         try {
51:             bais = new ByteArrayInputStream(baos.toByteArray());
52:             ois = new ObjectInputStream(bais);
53:             return (Die) ois.readObject();
54: 
55:         } finally {
56:             close(ois);
57:             close(bais);
58:         }
59:     }
60: 
61:     private static void close(Closeable os) {
62:         if (os != null) {
63:             try {
64:                 os.close();
65:             } catch (IOException e) {
66:                 // ignore e on close
67:             }
68:         }
69:     }
70: }
{% endhighlight %}

#### Interesting Lines
^
|-|-|
|Line|Description|
|16|Create a ByteArrayOutputStream from the underlying Die object. Rather than create a file on the file system, we instead serialize to a byte array for this example.|
|17|Read the byte array, which is assumed to be a serialized Die object.|
|19|Check to see if the faceValue before writing is the same as the faceValue after writing.|
|28 - 43|Use standard Java Serialization to attempt to write the Die object. If the Die class did not implement Serializable, this would fail with a java.io.NotSerializable exception. We made it Serializable using an aspect so this succeeds. We create a ByteArrayOutpuStream and serialize the Die in memory rather than to a file. This is quick way to clone an object.|
|45 - 59|We would not get to this method if the serializeObject() did not work. This method takes a ByteArrayOutputStream's byte array and attempts to read an object stored in the byte array.|

{% include nav prev="AspectJEX3SoWhatIsHappening" next="AspectJEX3ApplyYourself" %}
