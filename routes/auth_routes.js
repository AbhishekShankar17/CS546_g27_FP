//import express, express router as shown in lecture code

import { createEvent, createUser, getallevents, updateUser, getUserById, getallusers, getEventByName,updateEventReview ,getReviewByUserAndEvent, getReviewByUser, getAllReviewsByUser, getAllEventsByOrganizerId, getAllReviewsByEventId } from "../data/users.js";
import { checkUser } from "../data/users.js";
import validation from '../helpers.js';


import { Router } from "express";
const router = Router();

router.route("/").get(
  (req, res, next) => {
    if (req.session.user) {
      if (req.session.user.role == "user") {
        return res.redirect("/protected");
      }
      if (req.session.user.role == "admin") {
        return res.redirect("/admin");
      }
    } else {
      return res.redirect("/login");
    }
    next();
  },
  async (req, res) => {
    //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
    return res.json({ error: "YOU SHOULD NOT BE HERE!" });
  }
);

router
  .route("/register")
  .get(async (req, res) => {
    //code here for GET
    res.render("register");
  })
  .post(async (req, res) => {
    //code here for POST
    try {
      let firstNameInput;
      let lastNameInput;
      let emailAddressInput;
      let passwordInput;
      let confirmPasswordInput;
      let roleInput;
      
      if(req.body){
      firstNameInput= req.body.firstNameInput;
      lastNameInput= req.body.lastNameInput;
      emailAddressInput= req.body.emailAddressInput;
      passwordInput= req.body.passwordInput;
      confirmPasswordInput= req.body.confirmPasswordInput;
      roleInput= req.body.roleInput;
      }

      if (
        !firstNameInput ||
        !lastNameInput ||
        !emailAddressInput ||
        !passwordInput ||
        !roleInput ||
        !confirmPasswordInput
      ) {
        throw "Error: Must provide all fields";
      }
      firstNameInput = validation.checkString(
        firstNameInput,
        "First name"
      );
      if (firstNameInput.length < 2 || firstNameInput.length > 25) {
        throw "Error: Invalid first name length";
      }
      lastNameInput = validation.checkString(
        lastNameInput,
        "Last name"
      );
      if (lastNameInput.length < 2 || lastNameInput.length > 25) {
        throw "Error: Invalid last name length";
      }
      emailAddressInput = emailAddressInput.toLowerCase();
      if (
        !/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@stevens\.edu$/.test(
          emailAddressInput
        )
      ) {
        throw "Error: Email address must end with stevens.edu";
      }

      passwordInput = validation.checkString(
        passwordInput,
        "Password"
      );
      if (/^(.{0,7}|[^0-9]*|[^A-Z]*|[a-zA-Z0-9]*)$/.test(passwordInput)) {
        throw "Error: Invalid Passwords";
      }
      if (passwordInput.match(/\s/g)) {
        throw "Error: Invalid Passwords";
      }
      if (confirmPasswordInput !== passwordInput) {
        throw "Error: Passwords do not match";
      }
      roleInput = validation.checkString(roleInput, "Role");
      if (!/^(admin|user)$/.test(roleInput)) {
        throw "Error: Invalid role";
      }
    } catch (e) {
      return res.status(400).render("register", { error: `${e}`});
    }
    try {

      const newuser = await createUser(
        req.body.firstNameInput,
        req.body.lastNameInput,
        req.body.emailAddressInput,
        req.body.passwordInput,
        req.body.roleInput
      );

      let out = { insertedUser: true };
      if (
        Object.entries(newuser).toString() == Object.entries(out).toString()
      ) {
        return res.redirect("/login");
      } else {
        throw "Internal Server Error";
      }
    } catch (e) {
      return res.status(500).render("register", { error: `${e}` });
    }
  });

router.route("/login")
  .get(async (req, res) => {
    //code here for GET
    res.render("login");
  })
  .post(async (req, res) => {
    //code here for POST
    try {
      let {emailAddressInput, passwordInput} = req.body;
      if (!emailAddressInput || !passwordInput) {
        throw "Error: Must provide both email address and password";
      }
      emailAddressInput = emailAddressInput.toLowerCase();
      if (
        !/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          emailAddressInput
        )
      ) {
        throw "Error: Invalid email address";
      }

      passwordInput = validation.checkString(
        passwordInput,
        "Password"
      );
      if (
        /^(.{0,7}|[^0-9]*|[^A-Z]*|[a-zA-Z0-9]*)$/.test(passwordInput)
      ) {
        throw "Error: Invalid Password";
      }
      if (passwordInput.match(/\s/g)) {
        throw "Error: Invalid Password";
      }
    } catch (e) {
      return res.status(400).render("login", { error: `${e}`});
    }
    try {
      let auth_user = await checkUser(
        req.body.emailAddressInput,
        req.body.passwordInput
      );
      if (auth_user) {
        req.session.user = auth_user;
      }
      if(req.session.user){
        if (req.session.user.role == "admin") {
        return res.redirect("/admin");
      }
        if (req.session.user.role == "user") {
        return res.redirect("/protected");
      }
    }
    } catch (e) {
      return res.status(400).render("login", { error:`${e}`});
    }
  });

router.route("/protected").get(async (req, res) => {
  //code here for GET
  let admin = false;
  
  if(req.session.user){
  try{
    let today = new Date();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    if (req.session.user.role === "admin") {
      admin = true;
      res.render("protected", {
        firstName: req.session.user.firstName,
        currentTime: time,
        role: req.session.user.role,
        admin: admin,
    });
  }
  }catch(e){
    return res.status(500).render('error', {error:`${e}`});
  }
  let today = new Date();
  let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  res.render("protected", {
    firstName: req.session.user.firstName,
    currentTime: time,
    role: req.session.user.role
  });
  }
});

// router.route("/admin").get(async (req, res) => {
//   //code here for GET
//   let today = new Date();
//   let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
//   res.render("admin",{firstName: req.session.user.firstName, currentTime:time, admin:true});
// });

router.route("/admin").get(async (req, res) => {
  try {
    if (req.session.user && req.session.user.role === "admin") {
      let today = new Date();
      let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

      const organizerId = req.session.user._id;

      if (!organizerId) {
        console.error("OrganizerId is missing in the user session:", req.session.user);
        throw "OrganizerId must be provided!!!";
      }

      const allevents = await getAllEventsByOrganizerId(organizerId);

      const eventReviewsPromises = allevents.map(async (eachevent) => {
        const eventId = eachevent._id;

        const reviews = await getAllReviewsByEventId(eventId);

        return { event: eachevent, reviews };
      });

      const eventReviews = await Promise.all(eventReviewsPromises);

      // Extract all user reviews from all events
      const userReviews = eventReviews.flatMap(eventReview => eventReview.reviews);

      res.render("admin", {
        firstName: req.session.user.firstName,
        lastName: req.session.user.lastName,
        emailAddress: req.session.user.emailAddress,
        role: req.session.user.role,
        credits: req.session.user.credits,
        currentTime: time,
        admin: true,
        eventReviews: eventReviews,
        userReview: userReviews
      });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Error in /admin route:", error);
    res.status(500).render('error', { error: `${error}` });
  }
});





router.route("/error").get(async (req, res) => {
  //code here for GET
  res.status(403).render("error");
});

router.route("/logout").get(async (req, res) => {
  //code here for GET
  req.session.destroy();
  res.render("logout");
});

// router.route("/createEvent")
//   .get(async (req, res) => {
//     //code here for GET
//     res.render("createEvent");
//   })
//   .post(async (req, res) => {
//     //code here for POST
//     try {
//       // const {organizer, capacity, date, duration,location,time,eventName } = req.body;
//       // const newMeeting = new Meeting({
//       //         organizer,
//       //         capacity,
//       //         room,
//       //         date,
//       //         duration,
//       //         location,
//       //         time,
//       //         eventName,
//       //         // Add other meeting properties as needed
//       //       });
        
//             const savedMeeting = await createEvent(
//               req.body.organizer,
//               req.body.capacity,
//               req.body.date,
//               req.body.duration,
//               req.body.location,
//               req.body.time,
//               req.body.eventName,
//             );
        
//             // Deduct credits from the organizer
//             const updatedUser = await User.findByIdAndUpdate(
//               organizer,
//               { $inc: { credits: -1 } }, // Assuming each meeting costs 1 credit
//               { new: true }
//             );
        
//             res.status(201).json({ meeting: savedMeeting, user: updatedUser });
//     } catch (e) {
//       return res.status(400).render("createEvent", { error: `${e}`});
//     }
//   });

router.route("/createEvent")
  .get(async (req, res) => {
    // Check if the user is an admin
    let admin = false;

    if (req.session.user) {
      try {
        if (req.session.user.role === "admin") {
          admin = true;
          return res.render("createEvent", {
            firstName: req.session.user.firstName,
            role: req.session.user.role,
            admin: admin,
          });
        }
      } catch (e) {
        console.error(e);
        return res.status(500).render('error', { error: `${e}` });
      }
    }

    // If the user is not an admin or not logged in, handle accordingly
    return res.status(403).render("createEvent", { error: "You do not have permission to create events." });
  })
  router.route("/createEvent")
  .post(async (req, res) => {
    try {
      // Check if the user is an admin
      if (req.session.user.role === "admin") {
        // Rest of the code for POST

        const result = await createEvent(
          req.body.organizer,
          req.body.capacity,
          req.body.date,
          req.body.duration,
          req.body.location,
          req.body.time,
          req.body.eventName
        );

        //const savedMeeting = result.meeting;
        //const updatedUser = result.user;

        // Redirect to /login upon successful event creation
        return res.redirect("/login");
      } else {
        // If the user is not an admin, handle accordingly
        return res.status(403).json({ error: "You do not have permission to create events." });
      }
    } catch (e) {
      console.error(e);
      return res.status(400).render("createEvent", { error: `${e}` });
    }
  });




// router.route("/createEvent").get(async (req, res) => {
//   res.render("createEvent");
// }).
// post(async (req, res) => {
//   try {
//     const { room, date, duration,location,time,eventName } = req.body;
//     const organizer = req.user.id; // Assuming you use authentication middleware

//     const newMeeting = new Meeting({
//       organizer,
//       capacity,
//       room,
//       date,
//       duration,
//       location,
//       time,
//       eventName,
//       // Add other meeting properties as needed
//     });

//     const savedMeeting = await createEvent(
//       req.body.organizer,
//       req.body.capacity,
//       req.body.date,
//       req.body.duration,
//       req.body.location,
//       req.body.time,
//       req.body.eventName,
//     );

//     // Deduct credits from the organizer
//     const updatedUser = await User.findByIdAndUpdate(
//       organizer,
//       { $inc: { credits: -1 } }, // Assuming each meeting costs 1 credit
//       { new: true }
//     );

//     res.status(201).json({ meeting: savedMeeting, user: updatedUser });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// Delete Meeting
router.delete('/:id', async (req, res) => {
  try {
    const meetingId = req.params.id;
    const organizerId = req.user.id; // Assuming you use authentication middleware

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    if (String(meeting.organizer) !== organizerId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Check if the meeting is scheduled in the future, you might want to use a specific field for this
    if (meeting.date > new Date()) {
      await Meeting.findByIdAndDelete(meetingId);

      // Refund credits to the organizer
      const updatedUser = await User.findByIdAndUpdate(
        organizerId,
        { $inc: { credits: 1 } }, // Refund 1 credit
        { new: true }
      );

      res.json({ message: 'Meeting deleted successfully', user: updatedUser });
    } else {
      res.status(400).json({ error: 'Cannot delete past meetings' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.route("/filters").get(async (req, res) => {
  //code here for GET
  //let admin = false;
  
  
  try {
    
    const eventsList = await getallevents();
    res.json(eventsList);
    console.log("Got the event successfully");
  } catch (e) {
    res.status(200).json({error: e});
  }  
});

// router.route("/filters").get(async (req, res) => {

//   const eventsList = await getallevents();
//   let filteredEvents = eventsList;

//   if (req.query.search) {

//     const searchTerm = req.query.search;

//     // Filter the array directly   
//     filteredEvents = filteredEvents.filter(event => {
//       return event.eventName.includes(searchTerm) || 
//         event.organizer.includes(searchTerm) ||
//         event.capacity.includes(searchTerm) ||
//         event.date.includes(searchTerm) ||
//         event.duration.includes(searchTerm) ||
//         event.location.includes(searchTerm) ||
//         event.time.includes(searchTerm) ||
//         event.eventName.includes(searchTerm)
//     });

//   }

//   res.json(filteredEvents);

// });





router
  .route("/edituser")
  .get(async (req, res) => {
    // Code here for GET
    res.render("edituser");
  })
  .post(async (req, res) => {
    try {
      let newfirstNameInput;
      let newlastNameInput;
      let newemailAddressInput;
      let newpasswordInput;
      let newconfirmPasswordInput;
      let newroleInput;

      if (req.body) {
        newfirstNameInput = req.body.newfirstNameInput;
        newlastNameInput = req.body.newlastNameInput;
        newemailAddressInput = req.body.newemailAddressInput;
        newpasswordInput = req.body.newpasswordInput;
        newconfirmPasswordInput = req.body.newconfirmPasswordInput;
        newroleInput = req.body.newroleInput;
      }

      if (
        !newfirstNameInput ||
        !newlastNameInput ||
        !newemailAddressInput ||
        !newpasswordInput ||
        !newroleInput ||
        !newconfirmPasswordInput
      ) {
        throw "Error: Must provide all fields";
      }

      newfirstNameInput = validation.checkString(newfirstNameInput, "First name");
      if (newfirstNameInput.length < 2 || newfirstNameInput.length > 25) {
        throw "Error: Invalid first name length";
      }

      newlastNameInput = validation.checkString(newlastNameInput, "Last name");
      if (newlastNameInput.length < 2 || newlastNameInput.length > 25) {
        throw "Error: Invalid last name length";
      }

      newemailAddressInput = newemailAddressInput.toLowerCase();
      if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@stevens\.edu$/.test(newemailAddressInput)) {
        throw "Error: Email address must end with stevens.edu";
      }

      newpasswordInput = validation.checkString(newpasswordInput, "Password");
      if (/^(.{0,7}|[^0-9]*|[^A-Z]*|[a-zA-Z0-9]*)$/.test(newpasswordInput)) {
        throw "Error: Invalid Password";
      }
      if (newpasswordInput.match(/\s/g)) {
        throw "Error: Password cannot contain spaces";
      }
      if (newconfirmPasswordInput !== newpasswordInput) {
        throw "Error: Passwords do not match";
      }

      newroleInput = validation.checkString(newroleInput, "Role");
      if (!/^(admin|user)$/.test(newroleInput)) {
        throw "Error: Invalid role";
      }

      // Update user details
      await updateUser(
        newfirstNameInput,
        newlastNameInput,
        newemailAddressInput,
        newpasswordInput,
        newroleInput
      );

      // Update session variables
      req.session.user.firstName = newfirstNameInput;
      req.session.user.lastName = newlastNameInput;
      req.session.user.emailAddress = newemailAddressInput;
      req.session.user.password = newpasswordInput;
      req.session.user.role = newroleInput;

      // Redirect to login page after successful update
      res.redirect("/login");
    } catch (error) {
      res.status(400).render("edituser", { error: `${error}` });
    }
  });


  // router.route("/viewuser").get(async (req, res) => {
  //   //code here for GET
  //   let admin = false;
  // const userReview = await getReviewByUser(req.session.user.userId);
    
  //   if(req.session.user){
  //   try{
  //     if (req.session.user.role === "admin") {
  //       admin = true;
  //       res.render("viewuser", {
  //         firstName: req.session.user.firstName,
  //         lastName: req.session.user.lastName,
  //         emailAddress: req.session.user.emailAddress,
  //         role: req.session.user.role,
  //         credits: req.session.user.credits,
  //            userReview,
  //     });
  //   }
  //   }catch(e){
  //     return res.status(500).render('error', {error:`${e}`});
  //   }
    
  //   res.render("viewuser", {
  //     firstName: req.session.user.firstName,
  //     lastName: req.session.user.lastName,
  //     emailAddress: req.session.user.emailAddress,
  //     role: req.session.user.role,
  //     credits: req.session.user.credits,
  //        userReview,
  //   });
  //   }
  // });

  // router.route("/viewuser").get(async (req, res) => {
  //   try {
  //     let admin = false;
  //     let userReview;
  
  //     // Check if the user is logged in
  //     if (req.session.user && req.session.user.userId) {
  //       // Fetch user's review if user is logged in
  //       userReview = await getReviewByUser(req.session.user.userId);
  
  //       try {
  //         if (req.session.user.role === "admin") {
  //           admin = true;
  //           res.render("viewuser", {
  //             firstName: req.session.user.firstName,
  //             lastName: req.session.user.lastName,
  //             emailAddress: req.session.user.emailAddress,
  //             role: req.session.user.role,
  //             credits: req.session.user.credits,
  //             userReview,
  //           });
  //         }
  //       } catch (e) {
  //         return res.status(500).render('error', { error: `${e}` });
  //       }
  
  //       // Render viewuser page for non-admin users
  //       res.render("viewuser", {
  //         firstName: req.session.user.firstName,
  //         lastName: req.session.user.lastName,
  //         emailAddress: req.session.user.emailAddress,
  //         role: req.session.user.role,
  //         credits: req.session.user.credits,
  //         userReview,
  //       });
  //     } else {
  //       // Handle case where user is not logged in
  //       res.redirect("/login");
  //     }
  //   } catch (error) {
  //     // Handle the error thrown by getReviewByUser
  //     res.status(500).render('error', { error: `${error}` });
  //   }
  // });
  
  
  
  



  // router
  // .route('/userreviews')
  // .get(async (req, res) => {
  //   try {
  //     res.render('userreviews', {
  //       firstName: req.session.user.firstName,
  //       lastName: req.session.user.lastName
  //     });
  //   } catch (error) {
  //     res.status(500).render('error', { error: 'Internal Server Error' });
  //   }
  // })
  // .post(async (req, res) => {
  //   try {
  //     const { eventName, location, date, time, rating, comments } = req.body;

  //     if (!eventName || !location || !date || !time || !rating || !comments) {
  //       throw 'Error: Must provide all fields';
  //     }

      
  //     const result = await updateEventReview(eventName, location, date, time, rating, comments);

  //     if (result.success) {
        
  //       res.redirect('/viewuser');
  //     } else {
        
  //       throw result.error;
  //     }
  //   } catch (error) {
  //     res.status(400).render('userreviews', { error: `${error}` });
  //   }
  // });

  // router
  // .route('/userreviews')
  // .get(async (req, res) => {
  //   try {
  //     res.render('userreviews', {
  //       firstName: req.session.user.firstName,
  //       lastName: req.session.user.lastName
  //     });
  //   } catch (error) {
  //     res.status(500).render('error', { error: 'Internal Server Error' });
  //   }
  // })
  // .post(async (req, res) => {
  //   try {
  //     const { eventName, location, date, time, rating, comments } = req.body;

  //     if (!eventName || !location || !date || !time || !rating || !comments) {
  //       throw 'Error: Must provide all fields';
  //     }

  //     const userId = req.session.user.userId; // Assuming userId is available in the session

  //     // Check if the user has already submitted a review for the specified event
  //     const existingReview = await getReviewByUserAndEvent(userId, eventName, location, date, time);

  //     if (existingReview) {
  //       throw "You have already submitted a review for this event. You can edit your existing review on the 'View User' page.";
  //     }

  //     const result = await updateEventReview(userId, eventName, location, date, time, rating, comments);

  //     if (result.success) {
  //       res.redirect('/viewuser');
  //     } else {
  //       throw result.error;
  //     }
  //   } catch (error) {
  //     res.status(400).render('userreviews', { error: `${error}` });
  //   }
  // });


  router
  .route('/userreviews')
  .get(async (req, res) => {
    try {
      res.render('userreviews', {
        firstName: req.session.user.firstName,
        lastName: req.session.user.lastName,
      });
    } catch (error) {
      res.status(500).render('error', { error: 'Internal Server Error' });
    }
  })
  .post(async (req, res) => {
    try {
      const { eventName, location, date, time, rating, comments } = req.body;

      if (!eventName || !location || !date || !time || !rating || !comments) {
        throw 'Error: Must provide all fields';
      }

      const emailAddress = req.session.user.emailAddress;

      // Check if the event exists
      const event = await getEventByName(eventName);

      if (!event) {
        throw "Error: Event not found";
      }

      // Check if the user has already submitted a review for the specified event
      const existingReview = await getReviewByUserAndEvent(emailAddress, eventName, location, date, time);

      if (existingReview) {
        throw "You have already submitted a review for this event. You can edit your existing review on the 'View User' page.";
      }

      // Add the review to the event
      const result = await updateEventReview(emailAddress, eventName, location, date, time, rating, comments);

      if (result.success) {
        res.redirect('/viewuser');
      } else {
        throw result.error;
      }
    } catch (error) {
      res.status(400).render('userreviews', { error: `${error}` });
    }
  });




router.route("/viewuser").get(async (req, res) => {
    try {
      let admin = false;
      // let userReview;
  
      // Check if the user is logged in
      if (req.session.user && req.session.user.emailAddress) {
        // Fetch user's review if user is logged in
        const userReview = await getAllReviewsByUser(req.session.user.emailAddress);
        console.log(userReview);
  
        try {
          if (req.session.user.role === "admin") {
            admin = true;
            res.render("viewuser", {
              firstName: req.session.user.firstName,
              lastName: req.session.user.lastName,
              emailAddress: req.session.user.emailAddress,
              role: req.session.user.role,
              credits: req.session.user.credits,
              userReview,
            });
          }
        } catch (e) {
          return res.status(500).render('error', { error: `${e}` });
        }
  
        // Render viewuser page for non-admin users
        res.render("viewuser", {
          firstName: req.session.user.firstName,
          lastName: req.session.user.lastName,
          emailAddress: req.session.user.emailAddress,
          role: req.session.user.role,
          credits: req.session.user.credits,
          userReview,
        });
      } else {
        // Handle case where user is not logged in
        res.redirect("/login");
      }
    } catch (error) {
      // Handle the error thrown by getReviewByUser
      res.status(500).render('error', { error: `${error}` });
    }
  });





  
export default router;
