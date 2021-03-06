---
title: AspectJ_Example_3
---
{% include nav prev="AspectJ_Self_Study" next="AspectJEX3ExpectedVersusActualOutput" %}

## Predict the Output
Source files are here: [AspectJExample3src.zip](../files/AspectJExample3src.zip). If you need instructions on what do with these files, try [here](ExtractingSourceFilesIntoProject).

Have a look at the following Die class and the associated Main.main() method that serializes the Die.
----
### Die class
{% highlight java %}
package ex3;

public class Die {
    int faceValue;

    public Die() {
        roll();
    }

    public int roll() {
        int nextValue = (int) ((Math.random() * 6) + 1);
        setFaceValue(nextValue);
        return getFaceValue();
    }

    public int getFaceValue() {
        return faceValue;
    }

    public void setFaceValue(int faceValue) {
        this.faceValue = faceValue;
    }
}
{% endhighlight %}
----
### Main class
{% highlight java %}
package ex3;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.Closeable;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;

public class Main {
    public static void main(String[] args) throws IOException,
            ClassNotFoundException {
        Die d = new Die();
        int faceValue = d.getFaceValue();

        ByteArrayOutputStream baos = serializeObject(d);
        Die retrievedDie = deserializeObject(baos);

        if (retrievedDie.getFaceValue() != faceValue) {
            System.out.printf("Expected %d, but found %d\n", faceValue,
                    retrievedDie.getFaceValue());
        } else {
            System.out.printf("Serialization successful\n");
        }

    }

    private static ByteArrayOutputStream serializeObject(Die d)
            throws IOException {
        ByteArrayOutputStream baos = null;
        ObjectOutputStream oos = null;

        try {
            baos = new ByteArrayOutputStream(1024);
            oos = new ObjectOutputStream(baos);
            oos.writeObject(d);
        } finally {
            close(oos);
            close(baos);
        }

        return baos;
    }

    private static Die deserializeObject(ByteArrayOutputStream baos)
            throws IOException, ClassNotFoundException {
        ByteArrayInputStream bais = null;
        ObjectInputStream ois = null;

        try {
            bais = new ByteArrayInputStream(baos.toByteArray());
            ois = new ObjectInputStream(bais);
            return (Die) ois.readObject();

        } finally {
            close(ois);
            close(bais);
        }
    }

    private static void close(Closeable os) {
        if (os != null) {
            try {
                os.close();
            } catch (IOException e) {
                // ignore e on close
            }
        }
    }
}
{% endhighlight %}
----
### Assignment: Predict the Output
Given these 2 classes, predict the output. Please do so before continuing.

{% include nav prev="AspectJ_Self_Study" next="AspectJEX3ExpectedVersusActualOutput" %}
