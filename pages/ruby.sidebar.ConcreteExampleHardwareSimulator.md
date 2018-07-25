---
title: ruby.sidebar.ConcreteExampleHardwareSimulator
---
<span class="sidebar_title"> A Concrete Example of a Hardware Simulator</span>
In mid 2008, I worked with a great group of people on the East Coast. My task was to use their current problem as source material and to take them through TDD (not BDD) on their problem.

They already had a start on the problem and had pretty good source material on what the system needed to do. The system essentially simulated expensive hardware. This system would make testing the software to drive the expensive hardware. The problem involved capturing an over-the-wire protocol, which they were already doing in C++. The problem, then, was to take that protocol and respond appropriately and even initiate messages.

During the week I was there, we:
* Created an initially simple solution that evolved into something that nearly simulated a complete, albeit simple, "job". 
* We had fully tested the execution of the protocol, including starting the system up in simulated mode (staring a Java virtual Machine [JVM] directly) versus real mode, starting a JVM from a C++ application.

On Tuesday, the week after I left, they had managed to fix a few problems on protocol capture and had successfully processed a job. On Wednesday, they were successfully processing a number of simple jobs.

A few weeks later they were processing complex jobs and then a few weeks later they were processing up to 15 simultaneous complex jobs. Their simulator was fast enough that they had to slow it down.

In a very real sense, starting with a granule and letting the system grow through accretion is a viable way to build complex systems.
 
