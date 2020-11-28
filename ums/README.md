# README #

UMS is a unified education-based messaging platform that will seamlessly connect students to their professors and other classmates. It can be hard to keep track of key dates and instructions during online learning, and providing students with the ability to message their professors in real-time will help keep them on track. This web application allows students to directly message professors as well as other students in the class, including image-sharing capabilities in each chat. Students will also be able to create their own group chats separately from the class itself, which can benefit them by providing a single location for all of their school-related messages to be found and stored. The platform includes an authentication system to ensure platform-wide safety and security using Firebase and Google Account login. The platform also includes other functionality such as an Office Hour queue system. The key feature of this queue is that allows students to play mini-games against each other to increase their position in the queue, essentially speeding up the time it takes for them to talk to the professor (if they win, of course). Waiting in a queue can often be mundane, so this will also increase student happiness while waiting to speak to a CP or Professor. The initial user authentication will be done using Google Firebase, using the student’s .edu email address. From here, we will implement our own authentication system on top of Google’s system for game processing.

### How do I get set up? ###

* Unzip the project.
* Navigate to /ums/web/ in your terminal or command line interface.
* Run “npm install”.
* Once this completes, run “npm start”.
* The web application is being served locally on port 3000.
Note: Safari currently does not support the needed web interfaces that Firebase relies on. As such, please use Firefox or Chrome to ensure the site will show properly.

### Who do I talk to? ###

* Jordan Bettencourt (jbettenc@usc.edu)
