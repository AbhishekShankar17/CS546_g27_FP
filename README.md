# CS546_g27_FP
MeetSmart: Campus Meeting Management System

Description:

- Create an account
Open the MeetSmart website in your web browser.
Fill in the required information, including a valid email address and a secure password.
Submit the registration form.
- Login to your account
Enter your registered email address and password and log into the account
- Explore Available Credits:
While creating the account , you can select either of the two options: User and Admin
- After you log in as an admin, you will be taken to a page where you can view multiple options almost simiar to when you log in as a user but the key difference is that you can only create events when you log in as an admin. You can always update your role to user or admin.

Lets say , you logged in as user and you want to create an event, you can change your role and create events.
Whenever you create an event , one credit will be deducted.
- Browse Meeting/Event Options:
  Use event name to find suitable meetings.
- Book a Meeting/Event:  
Once you find a meeting/event of interest , register for that event.
- Edit Your Profile:
Explore the "Profile" section to view and edit your personal information.
- Provide Reviews:
Share your feedback and experiences by providing a review
- Email Notifications:
MeetSmart sends confirmation emails to users for important events, such as successful registration, meeting/event booking, and credit transfers


- How To Setup:

We have Project Folder containing:

- config/; stores all configuration settings.
  
- data/; contains all database access modules
  
- public/; for public assets (stylesheets, JS)
  
- ​​routes/; contains all routing scripts

- views/; contains HTML views and templates
  
- app.js; initializes and runs a server
  
- helpers.js; validation checking
  
- package.json; describes the application, and its dependencies

Note: we need to add "type": "module", "start": "node app.js"

The dependencies we used here are:
- Mongodb
- Express
- Bcrypt
- nodemailer

Steps to run
- Install all those dependencies using ‘ npm install ’
- After Installation run the application using ‘ npm run ’
- To start the server ‘ npm start ’
- To access the web browser go to ‘ http://localhost:3000 ’ 

link to our github https://github.com/AbhishekShankar17/CS546_g27_FP/blob/main/


