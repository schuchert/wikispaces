---
title: FitNesse.Installing
---

* [Download FitNesse](http://fitnesse.org/FrontPage.FitNesseDevelopment.DownLoad)
* Place the downloaded zip file in some directory (hint, this next step creates a directory called FitNesse// **under//** where you execute this command). For reference, I'll be using ~/src/. The next step will create ~/src/FitNesse
* Execute the jar file once to get it extracted:
```terminal
    java -jar fitnesse.jar
```
Note, this also attempts to start FitNesse on port 80. After this is done, you'll either see an error message (if port 80 is in use):

```terminal
    FitNesse cannot be started...
    Port 80 is already in use.
    Use the -p <port#> command line argument to use a different port.```
```
Or you'll see a message similar to this:
```terminal
        port:              80
        root page:         fitnesse.wiki.FileSystemPage at ./FitNesseRoot
        logger:            none
        authenticator:     fitnesse.authentication.PromiscuousAuthenticator
        html page factory: fitnesse.html.HtmlPageFactory
        page version expiration set to 14 days.
```

If you see the second option, kill FitNesse for now (hit ctrl-C).
