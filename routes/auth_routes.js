//import express, express router as shown in lecture code

import { createEvent, createUser } from "../data/users.js";
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

router.route("/admin").get(async (req, res) => {
  //code here for GET
  let today = new Date();
  let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  res.render("admin",{firstName: req.session.user.firstName, currentTime:time, admin:true});
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

router.route("/createEvent")
  .get(async (req, res) => {
    //code here for GET
    res.render("createEvent");
  })
  .post(async (req, res) => {
    //code here for POST
    try {
      // const {organizer, capacity, date, duration,location,time,eventName } = req.body;
      // const newMeeting = new Meeting({
      //         organizer,
      //         capacity,
      //         room,
      //         date,
      //         duration,
      //         location,
      //         time,
      //         eventName,
      //         // Add other meeting properties as needed
      //       });
        
            const savedMeeting = await createEvent(
              req.body.organizer,
              req.body.capacity,
              req.body.date,
              req.body.duration,
              req.body.location,
              req.body.time,
              req.body.eventName,
            );
        
            // Deduct credits from the organizer
            const updatedUser = await User.findByIdAndUpdate(
              organizer,
              { $inc: { credits: -1 } }, // Assuming each meeting costs 1 credit
              { new: true }
            );
        
            res.status(201).json({ meeting: savedMeeting, user: updatedUser });
    } catch (e) {
      return res.status(400).render("createEvent", { error: `${e}`});
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
export default router;
