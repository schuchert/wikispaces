---
title: HeavyEquipmentRental
---
## Heavy Equipment Rental Repair Shop

### The Problem

Currently we rent several kinds of heavy equipment such as tractors, forklifts, cement mixers, etc. All of this equipment has a maintenance schedule that is poorly followed, at best. In practice, much of the equipment misses its scheduled maintenance, which leads to more breaks in the field. We believe that preventative maintenance costs less money and requires less time than repairs caused by a lack of maintenance and we want to better manage our resources by:
* Knowing the maintenance schedule for each kind of equipment
* Knowing the usage history of each piece of equipment
* Knowing what scheduled and preventative maintenance needs to be done on a piece of equipment immediately upon its return
* Knowing what scheduled and preventative maintenance is in the near future when a piece of equipment is scheduled for a rental and when it is actually rented
* Based on rental history (average rental times for each kind of equipment along with margins based on rental rates), knowing which scheduled maintenance, preventative maintenance and repairs are of the highest priority
* Track the work of a piece of equipment from cradle to grave
* Maintain the history of all work done on a piece of equipment during our ownership of that equipment
* Know the inventory of parts and materials used for all of the equipment in our shop
* Automatically order parts and materials based on current schedules and inventory levels

### Notes

#### Interview with Joe—Repair Shop Manager
The way things work around here is this: We have a bunch of broken things come in. We fix them and ship them back out. I don’t have much time to go into more detail, but I’ll give you what I have. The rental stores are always bugging us to get equipment back to them—each piece is always the most important so I’ll be really interested to see how this “demand driven” mojo you guys are making is going to work.

So what happens is: when a piece of equipment comes in, we run a diagnostic to find out why it’s broke. We also take a look at the maintenance log (if we can find it) to see when the last scheduled maintenance was so we can figure out all the jobs we have to do on it while we have it. Usually we do all the missed jobs on the maintenance schedule and anything coming up soon because we never know if we’ll get it back before the scheduled time. It’d be good for the new system to keep track of those for us automatically since we sometimes miss one or two jobs.

Each job requires certain parts, tools, and skills. If we don’t have the parts, we order them and have the technician work on something else—there’s always work to do. I don’t worry about the tools: the techs own their own tools and they’re not my problem. Not all techs are certified to do each job, so we look at that too.

We get the job description from the Mitchell Labor Estimate Guide, and it tells us the standard time to do the job, the skill codes for the job, and the part #s & quantity we’ll need. It also mentions tools that were used to come up with the standard time.

I don’t assign work to people. The techs are paid a rate based on the standard time for the job. That means they’re always trying to grab the work that takes 5 minutes with the right tool when the standard time for it’s 60 because those times were set by people without the right tools—they can bill 15-20 hours on a good 8 hour day. They check off the work in the maintenance log when they’re done and put down anything they think the next tech needs to know about.

After the OSHA audit a few years ago, I have to worry about making sure that a tech doesn’t take on a job he’s not certified for, so I make sure that every tech is certified to do every job, every time.

I don’t really know what William has in mind for the system other than he seems really interested in prioritizing the work based on rental store demand. I’d like to see the stores send in the equipment for its scheduled maintenance on time—but you’ll never find a store owner that will give up a rental until the thing’s broke. I’d also like to see purchasing do their job, but it’s like pulling teeth sometimes to get the parts we need.

#### Interview with Pete—Repair Technician
Joe takes a walk after lunch every day and stares hard at us if he thinks we shouldn’t be doing some work. ‘Course, he fired someone last summer for doing stuff he shouldn’t, so we’re pretty good about it.

I built my own computer from parts at Fry’s last summer, and I spend a lot of time playing Half-Life 2. I can’t get into World of Warcraft and all those fairies and elves games—but I really like the shooters.

The scheduled maintenance is pretty easy. Each type of equipment has its own schedule, and we do jobs based on what the schedule tells us. Some schedules are based on mileage, some on time, and some simply on use (like we clean the margarita machines out every 2nd use and recharge the porta-potty every time). We’ve gotten away from the mileage-based schedules and just assume the things that move will get rode hard all the time they’re away, so we mostly use time-based for them (like changing the oil in the backhoes every 2 months).

#### Notes from William Parcell—Head of IT
Currently some equipment is coming into the shop long after its scheduled maintenance due date because it’s broken down in the field. While this isn’t such a big deal for lawn aerators, it’s expensive for the larger equipment (like the forklifts). The primary goal of this new system is to pull equipment in for scheduled maintenance when it’s due.

The current repair Shop is running at breakneck speed and not really keeping up with the needs. We believe it’s mostly because repairs are so much more difficult than maintenance. Until we get things in hand, though, we need to help make the Shop operate more effectively and we’ve noticed that one of the big time sinks is the wait for parts—so we’d like to quickly put together a simple inventory control system that re-orders parts when they get below a certain threshold.

We looked at buying this stuff—but we didn’t like what we saw out there. Most of it was fine for garages, but it won’t work for us. What we really need is to prioritize our work based on the demand for the equipment in the stores. The existing rental system can tell us for each store and each type of equipment how many times it was rented in the last month. I really think that will increase our rentals by thousands of dollars for each store—and so do the store managers.

I have to run. If you have any other questions, talk to Dave.

#### Notes from Dave
Yeah, it’s kinda crazy. But, we already have an electronic version of Mitchell’s, so we don’t have to do any of the data entry for all those job descriptions.

Plus, I’ve been playing Halo 3 with Pete, and he says we probably don’t need to do that scheduling system right off the bat since they already know what’s hot and what’s not. We still gotta convince William though—and the stores. I think they bought into this whole idea because of that.

### Hints
* External systems will be actors
* Not all the actors are explicitly mentioned (the roles that business people usually forget are forgotten here too)
* The SMEs tell us different things are important
* The central concept to understand how to manage the repair Shop is talked about, but not in 24 point font
* It’s not already broken down into iterations for you
