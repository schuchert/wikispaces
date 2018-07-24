---
title: tddisnotenough.GRASP
---
[<==Back]({{ site.pagesurl}}/TddIsNotEnough#GRASP)

|Name|Summary Description|
|Information Expert|Assign responsibility to the thing that has the information.|
|Controller|Assign system operations (events) to a non-UI class. May be system-wide, use case driven or for a layer.|
|Low Coupling|Try to keep the number of connections small. Prefer coupling to stable abstractions.|
|High Cohesion|Keep focus. The behaviors of a thing should be related. Alternatively, clients should use all or most parts of an API.|
|Polymorphism|Where there are variations in type, assign responsibility to the types (hierarchy) rather than determine behavior externally,|
|Pure Fabrication|Create a class that does not come from the domain to assist in maintaining high cohesion and low coupling.|
|Protected Variations|Protect things by finding the change points and wrapping them behind an interface. Use polymorphism to introduce variance.|

[<==Back]({{ site.pagesurl}}/TddIsNotEnough#GRASP)
