---
title: PPPChapter9Exercise
---
[<-- Back](PPPChapter8Exercise) [up](Vancouver_PPP_Exercise_Ch8and9)

## Part 2: Unit 9

You have been tasked with "reusing" what's already there. You've already pulled out one or more components to support that functionality -- catalog maintenance -- how does your component measure up?

We just discussed several component coupling principles:
* **Acyclic Dependencies Principle**
* **Stable Dependencies Principle**
* **Stable Abstractions Principle**

We also just learned about several metrics we can use to evaluate our components:
### Instability
{% include include_md_file filename="InstabilityFormula.md" %}

**Abstractness** 
{% include include_md_file filename="Abstractness.md" %}

### Distance from Main Sequence
{% include include_md_file filename="DistanceFromMainSequence.md" %}

## Original diagram
What are the values for the original diagram?

### Middle Tier
$$
C_E = 0
$$
^
$$
C_A = 7
$$
^
$$
I = \frac{0}{0+7} = 0
$$
^
$$
A = \frac{2}{14} = 0.143
$$
^
$$
D = |0.143 + 0 - 1| = 0.857
$$ 

### UI Tier
^
$$
C_E = 7
$$
^
$$
C_A = 0
$$
^
$$
I = \frac{7}{7+0} = 1
$$
^
$$
A = \frac{1}{5} = 0.2
$$
^
$$
D = |1 + .2 - 1| = 0.2
$$ 

----
What to do next?
* Now perform these calculations for your new component configuration. How do you compare?
* What can you say about the components that have a "large" distance from the main sequence?
* Knowing what you now know, work through a second round of componentization.

----
Final Observations
* What is your experience with doing this kind of work?
* What tool support have you used or do you see available to assist in this work?
* Why go to all this trouble?

{% include include_md_file filename="PPPChapter9Exercise_Image.md" %}

[<-- Back](PPPChapter8Exercise) [up](Vancouver_PPP_Exercise_Ch8and9)
