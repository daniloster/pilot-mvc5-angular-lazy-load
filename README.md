Pilot C# MVC5 (EF6, AngularJS, RequireJS)
============================

Pilot project integrating MVC5 and Entity Framework 6, front-end based on requirejs and angularjs with lazy load.

## Roadmap
1. Purpose
2. Basic aproaching of modules
  1. ~~DI (*Dependency injection*)~~
  2. ~~ASP MVC5~~
  3. ~~Javascript (AngularJS + RequireJS)~~
  4. ~~WCF~~
  5. ~~Services~~
  6. ~~Entity Framework 6~~
  7. ~~Entities (POJO)~~
3. ~~Getting started~~
  1. ~~How to modulate your project~~
  2. ~~Which files should be created~~
  3. ~~How to implement lazy load of controllers and services (factories)~~
4. ~~Contributors~~
5. ~~Come together~~


### Purpose
The idea behind this project is to spread part of my "old bag" and the new knowledge which I've learnt in the last few days. I'd created a challenge for myself and that was the result. The project consist in build a metodology of development with angularjs, in which one I could notice the performance of application and how faster can be to develop web projects with SPA (*Single Page Application*).
Considering that SPA works with partial rendering, we could aproach in two ways.
* Load your whole application at the first access and show content on demand
* Load your application on demand as long as it is necessary.

For this project, I've taken the second path.

### Basic aproaching of modules
Before we start properly it (I love code first also), we need to understand some basic topics. I'll just give basic concepts about each one. But it is important understand it with your heart. I used to say that everything becomes easy after total understanding of the engines.
