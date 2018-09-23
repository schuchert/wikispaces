---
title: PMD_In_Eclipse
---
{% include nav prev="Tool_Setup_and_Configuration_Notes" %}

## Using PMD in Eclipse

### Install PMD
* Start Eclipse
* Follow [these instructions](http://pmd.sourceforge.net/integrations.html#eclipse) (if you are not set to the Eclipse section, click on Eclipse in the list)
* Restart Eclipse

### Set up Preferences
* Download this file: [PMDConfig.xml](files/PMDConfig.xml). I recommend downloading this to your workspace directory
* Windows:Preferences:PMD:Rules Configuration
* Clear All
* Confirm by clicking OK
* import rule set...
* Browse
* Select the file you downloaded above
* Click OK to complete import
* Click OK to close Windows:Preferences
* When prompted to perform a full rebuild, select yes.

{% include nav prev="Tool_Setup_and_Configuration_Notes" %}
