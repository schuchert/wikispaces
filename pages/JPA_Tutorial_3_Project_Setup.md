---
title: JPA_Tutorial_3_-_Project_Setup
---
For the rest of this section, when you see **<project>**, replace it with **JpaTutorial3**
[include_page="JPA_Tutorial_Project_Setup"](include_page="JPA_Tutorial_Project_Setup")

### Update persistence.xml
**Update Persistence Unit Name**
The name of the persistence unit in your just-copied persistence.xml is **examplePersistenceUnit** in this example we use **lis** for Library Information System. Make the following change:
{% highlight xml %}
    <persistence-unit name="examplePersistenceUnit" 
                      transaction-type="RESOURCE_LOCAL">
{% endhighlight %}

{% highlight xml %}
    <persistence-unit name="lis" 
                      transaction-type="RESOURCE_LOCAL">
{% endhighlight %}

Your project is now set up.
