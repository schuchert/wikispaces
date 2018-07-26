---
title: Team_Jeopardy
---
[Team_Jeopardy_User_Stories]({{site.pagesurl}}/Team_Jeopardy_User_Stories)

Team Jeopardy is loosely based on the game Jeopardy. Here are the similarities:
* We have a number of players (any number can play, most recently I tried with 4 groups of 4 and then 6 groups of 2, I preferred the 6 groups of 2)
* The first player/group is randomly selected
* The select a category and point amount
* Someone tries to take the question and either gets it or does not
* If someone gets it wrong, the question remains open for a time or until nobody wants to take it

Here are some of the differences:
* No daily double
* There's just one round
* The students run a client on their machine
* The instructor runs a server on a machine that is displayed on an overhead projector
* The students provide the answers and the questions
* The instructor groups all of the questions, created categories, assigns points and prepares the game

We play this as a form of review. It works the brain in several significant different ways from typical reviewing:
* Students are thinking in terms of answers before the questions
* When given an answer, the student has to figure out the question, which is backwards from what they are used to
* There is a mild form of competition since the game keeps track of points

In practice, this style of review really seems to engage people, is fun and the students actually learn things, so I'm using it on a weekly basis in an 8-week boot camp.

Here's a set of class and source files that will allow you to play:
> [[file:temp.7z]]
* Extract this [7-ZIP]({{ site.pagesurl}}/www.7-zip.org) file somewhere, say C:\jeopardy
* Make sure a 1.5 JVE is available to run the client and server
* Start a dos shell
* Execute the server, it requires three parameters: <name of boardfile> <port to listen on> <time_in_seconds_allowed_to_answer>
* Assuming you run this batch file in the c:\jeopardy directory, you can simply use: jserver ./board.txt 80 120
* Stat a second dos shell
* Go to the c:\jeopardy directory
* To execute the client, you need specify: <unique_name> <machine> <port>
* For example, you could use: jclient BrettSchuchert localhost 80
* Once at least on client is started, you can begin the game.
* In the server window, begin the game by pressing b<enter>
* Next, select a question by selecting s<enter>
* Select one of the categories, 1<enter>
* Enter the dollar amount, 200<enter>
* Now a client can try to take the question by pressing <enter>
* When they do, they answer to whomever is running the server. If they answer correctly, the person running the server will indicate a correct answer by: c<enter>
* If the answer is not correct, they'll indicate it by: i<enter>
* If nobody takes the question, they'll indicate it by: n<enter>
* Repeat until you run out of questions.

Here are some example sets of AnswerQuestions:
* Week 1: Java Programming Weeks [TeamJeopardy.Round_1]({{site.pagesurl}}/TeamJeopardy.Round_1)
* Week 2: Project Week [TeamJeopardy.Round_2]({{site.pagesurl}}/TeamJeopardy.Round_2)
* Week 3: OOAD Course Week:
* Week 4: Project Week 2
* Week 5: JWEB Class
* Week 6: Project Week 3
* Week 7: Advance Java Week (they will write the Jeopardy Server/Client)
* Week 8: Project Week 4
