* Install Scala
>> I used mac ports

* Install Eclipse plugin: http://www.scala-lang.org/node/94

* Thanks to [[http://www.softwaresecretweapons.com/jspwiki/scalatoolsnscfatalerror-object-scala-not-found|this site]] I was able to figure out that you need to add the following jar files to your class path to be able to actually edit a Scala file:
** scala-compiler.jar
** scala-library.jar

My files happened to reside in /opt/local/share/scala/lib