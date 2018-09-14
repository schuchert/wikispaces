---
title: EJB3_Tutorial_1_-_Background
---
A Session Bean provides an interface to a service, wraps business logic or might simply act to hide the details of using JPA. The design pattern that comes to mind is [facade](http://en.wikipedia.org/wiki/Fa%C3%A7ade_pattern).

Creating a Session Bean using EJB3 is comparatively painless compared to previous versions of the EJB specification. In the simplest configuration, a session bean only needs to implement an interface and then be denoted as a session bean with meta-information. EJB3 uses configuration by exception to keep the requirements to a minimum.

EJB meta-information comes in two forms: Annotations or XML files. As with JPA, XML files take precedence over annotations. These tutorials use annotations.
