---
title: JBoss_AOP_Example_2
---
[<--Back](JBoss_AOP_Self_Study) [Next-->](JBossAOPEX2ExpectedVersusActualOutput)

# Predict the Output
Source files are here: [[file:JBossAOPExample2src.zip]]. If you need instructions on what do with these files, try [here](ExtractingSourceFilesIntoProject).

Have a look at the following Main.main() method and the associated Address class.
----
## Main class
{% highlight java %}
package ex2;

public class Main {
	public static void main(String args[]) {
		Address a = new Address();
		a.setAddressLine1("5080 Spectrum Drive");
		a.setAddressLine2("Suite 700 West");
		a.setCity("Dallas");
		a.setState("TX");
		a.setZip("75001");
		a.setZip("75001");
	}
}
{% endhighlight %}
----
## Address class
{% highlight java %}
package ex2;

import java.io.Serializable;

@SuppressWarnings("serial")
public class Address implements Serializable {
	private String addressLine1;
	private String addressLine2;
	private String city;
	private String state;
	private String zip;

	public String getAddressLine1() {
		return addressLine1;
	}

	public void setAddressLine1(String addressLine1) {
		this.addressLine1 = addressLine1;
	}

	public String getAddressLine2() {
		return addressLine2;
	}

	public void setAddressLine2(String addressLine2) {
		this.addressLine2 = addressLine2;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getZip() {
		return zip;
	}

	public void setZip(String zip) {
		this.zip = zip;
	}
}
{% endhighlight %}
----
## Assignment: Predict the Output

Given these 2 classes, predict the output. Please do so before continuing.

[<--Back](JBoss_AOP_Self_Study) [Next-->](JBossAOPEX2ExpectedVersusActualOutput)
