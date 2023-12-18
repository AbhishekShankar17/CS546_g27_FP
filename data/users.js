//import mongo collections, bcrypt and implement the following data functions
import {events, users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import bcrypt from 'bcrypt';
import validation from '../helpers.js';

    
export const createUser = async (
  firstName,
  lastName,
  emailAddress,
  password,
  role,
) => {
  if( !firstName|| !lastName|| !emailAddress|| !password|| !role){
    throw 'Error: Must provide all fields'
  }
  firstName = validation.checkString(firstName, "First name");
  if(firstName.length<2 || firstName.length>25){
    throw 'Error: Invalid first name length'
  }
  lastName = validation.checkString(lastName, "Last name");
  if(lastName.length<2 || lastName.length>25){
    throw 'Error: Invalid last name length'
  }
  
  const userCollection= await users();
  let user = await userCollection.findOne({emailAddress})
  if(user){
      throw 'there is already a user with that email address'
    }

  password = validation.checkString(password, "Password");
  if((/^(.{0,7}|[^0-9]*|[^A-Z]*|[a-zA-Z0-9]*)$/.test(password))){
    throw 'Your password must at least have one uppercase character, at least one number and at least one special character'
  }
  if(password.match(/\s/g)){
    throw 'Error: Invalid Password'
  }
  role = validation.checkString(role, "Role")
  role = role.toLowerCase();
  if(!(/^(admin|user)$/.test(role))){
    throw 'Error: Invalid role'
  }
  const hash = await bcrypt.hash(password, 16);
  let newUser={
    firstName: firstName,
    lastName: lastName,
    emailAddress: emailAddress,
    password: hash,
    role: role,
    credits:100,
    createdEvents : [],
    registeredEvents : []
  }
  
  const insertInfo = await userCollection.insertOne(newUser);
  console.log('Inserted the user into the databse successfully')
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw 'Could not add band'
  let obj={insertedUser: true};
  return obj;
};

export const checkUser = async (emailAddress, password) => {
  if(!emailAddress|| !password){
    throw 'Error: emailAddress or password not supplied'
  }
  if(!( /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailAddress))){
    throw 'Error: Invalid email address'
  }
  emailAddress = emailAddress.toLowerCase();
  password = validation.checkString(password, "Password");
  if((/^(.{0,7}|[^0-9]*|[^A-Z]*|[a-zA-Z0-9]*)$/.test(password))){
    throw 'Error: Invalid Password'
  }
  if(password.match(/\s/g)){
    throw 'Error: Invalid Password'
  }

  const userCollection = await users();
  let userList = await userCollection.findOne({emailAddress:emailAddress});
  let found=false;
  let tempuser;
  if(userList){
    found = true;
    tempuser = userList;
  }
  // for(let i in userList){
  //   if(userList[i].emailAddress===emailAddress){
  //     tempuser = userList[i];
  //     found=true;
  //   }
  // }
  if(found==false){
    throw 'Either the email address or password is invalid'
  }
  let compareToMatch = await bcrypt.compare(password, tempuser.password);
  if(!compareToMatch){
    throw 'Either the email address or password is invalid'
  }
  delete tempuser.password;
  return tempuser;
};

export const createEvent = async (
//   organizerName,
  capacity,
  date,
  duration,
  location,
  time,
  eventName,
  currentUserEmail
) => {


    // if(!req.session.user || !req.session.user.emailAddress) throw "Organizer not found";

    // const organizerEmailAddress = req.session.user.emailAddress;

//   if (!organizerName || !date || !duration || !location || !time || !eventName || !capacity) {
//     throw 'Error: Must provide all fields';
//   }

if ( !date || !duration || !location || !time || !eventName || !capacity) {
    throw 'Please provide all fields';
  }

//   organizerName = organizerName.toLowerCase().trim();
  eventName = eventName.toLowerCase().trim();
  location = location.toLowerCase().trim();
  if(isNaN(capacity)) throw "capacity should be a number";
  if(isNaN(duration)) throw "capacity should be a number";
  if(duration > 8) throw "Maximum event duration is 8 hours ";

  
  

  const eventCollection = await events();
  const usersCollection = await users();

  // Fetch the user's _id based on the organizerName
  const user = await usersCollection.findOne({ emailAddress: currentUserEmail.trim() });
  if (!user) {
    throw `User not found`;
  }

    // Format date to MM-DD-YYYY
    const [year, month, day] = date.split('-');
    const formattedDate = `${month}/${day}/${year}`;

  // Format time to HH:MM AM/PM
  const formattedTime = new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const currDate = new Date();

  const inpDate = new Date(date)

  if (currDate > inpDate) {
    // Validation failed, the provided date and time is earlier than today's date and time
    throw new Error("Date and time cannot be earlier than today's date and time.");
  }

  let newEvent = {
    organizer: new ObjectId(user._id),
    capacity: capacity,
    date: formattedDate,
    duration: duration,
    location: location,
    time: formattedTime,
    eventName: eventName.toLowerCase(),
    registrations : []
  };

  const insertInfo = await eventCollection.insertOne(newEvent);

  console.log("Created the New Event with id ", newEvent.organizer);

  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw 'Could not add event';
  }

  await usersCollection.updateOne(
    { _id: new ObjectId(newEvent.organizer) },
    { $inc: { credits: -1 }, $push: { createdEvents: newEvent._id.toString() } }
  );
  // Assuming you want to send a JSON response
  return { meeting: newEvent };
};




export const getallevents = async (
  ) => {
    const eventsCollection = await events();
    const eventsList = await eventsCollection.find({}).toArray();
    //console.log(eventsList);
    return eventsList;
  };



  export const getEventByName = async (eventName) => {
    if (!eventName) {
      throw "Must provide eventName!!";
    }
  
    if (typeof eventName !== 'string' || eventName.trim().length === 0) {
      throw "eventName must be a non-empty string!!";
    }

    eventName = eventName.toLowerCase();
  
    const eventCollection = await events();
    const event = await eventCollection.findOne({ eventName });
  
    if (!event) {
      throw `Event with name '${eventName}' not found`;
    }
  
    return event;
  };
  

  export const getallusers = async (
    ) => {
      const usersCollection = await users();
      const usersList = await usersCollection.find({}).toArray();
      //console.log(usersList);
      return usersList;
    };

  export const getUserById = async (id) => {
    if (!id) throw 'You must provide an id';
  
    const usersCollection = await users();
  
    const user = await usersCollection.findOne({ 
      _id: new ObjectId(id) 
    });
  
    if (!user) throw 'User not found';
  
    return user;
  }

  export const updateUser = async (
        firstName,
        lastName,
        emailAddress,
        password,
        role,
      ) => {
        if( !firstName|| !lastName|| !emailAddress|| !password|| !role){
                throw 'Error: Must provide all fields'
              }
              firstName = validation.checkString(firstName, "First name");
              if(firstName.length<2 || firstName.length>25){
                throw 'Error: Invalid first name length'
              }
              lastName = validation.checkString(lastName, "Last name");
              if(lastName.length<2 || lastName.length>25){
                throw 'Error: Invalid last name length'
              }
              emailAddress = emailAddress.toLowerCase();
              if(!( /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailAddress))){
                throw 'Error: Invalid email address'
              }
              const userCollection= await users();
            
              password = validation.checkString(password, "Password");
              if((/^(.{0,7}|[^0-9]*|[^A-Z]*|[a-zA-Z0-9]*)$/.test(password))){
                throw 'Error: Invalid Password'
              }
              if(password.match(/\s/g)){
                throw 'Error: Invalid Password'
              }
              role = validation.checkString(role, "Role")
              role = role.toLowerCase();
              if(!(/^(admin|user)$/.test(role))){
                throw 'Error: Invalid role'
              }
              const hash = await bcrypt.hash(password, 16);    
  
    const updateObj = {
      firstName,
      lastName, 
      emailAddress: emailAddress.toLowerCase(),
      password: hash,
      role: role.toLowerCase()
    };  
    const result = await userCollection.updateOne(
      {},
      { $set: updateObj } 
    );
    //console.log('ID:', id); 
    //console.log('Update Data:', updateObj);
  
    if (!result.matchedCount && !result.modifiedCount) 
      throw 'Update failed';
  
    return updateObj;
  }

  export const getEventByDetails = async (eventName, location, time, date) => {
    try {
      const eventCollection = await events();
  
      const existingEvent = await eventCollection.findOne({
        eventName,
        location,
        time,
        date,
      });
      return existingEvent;
    } catch (error) {
      console.error('Error in getEventByDetails:', error);
      throw error;
    }
  };


// export const eventRegistration = async (eventName, location, date, time, req) => {
//     // Validate input fields
//     if (!eventName || !location || !date || !time) {
//       throw 'Please provide all fields';
//     }

//     const eventCollection = await events();
//     const userCollection = await users();

//     // Assuming user information is stored in the session
//     const user = req.session.user;
//     console.log(user);

//     if (!user) {
//       throw 'User not found in the session';
//     }

//   // Format date to MM-DD-YYYY
//   // const formattedDate = new Date(date).toLocaleDateString('en-US', {
//   //   month: '2-digit',
//   //   day: '2-digit',
//   //   year: 'numeric',
//   // });

//   // // Format time to HH:MM AM/PM
//   // const formattedTime = new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
//   //   hour: '2-digit',
//   //   minute: '2-digit',
//   // });

//   // Extract year, month, and day from the date
//   const [year, month, day] = date.split('-');

//   // Combine sections into MM-DD-YYYY format
//   const formattedDate = `${month}/${day}/${year}`;

//   // // Format time to HH:MM AM/PM
//   const formattedTime = new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
//     hour: '2-digit',
//     minute: '2-digit',
//   });

// console.log(eventName);
// console.log(location);
// // console.log(date);
// // console.log(time);
// console.log(formattedDate);
// console.log(formattedTime);

//     // Check if the event exists
//     const existingEvent = await eventCollection.findOne({
//       eventName: eventName.trim(),
//       location: location.trim(),
//       date: formattedDate.trim(),
//       time: formattedTime.trim(),
//       // date: date.trim(),
//       // time: time.trim()
//     });
// console.log(existingEvent);
//     if (!existingEvent) {
//       throw 'Event not found';
//     }

//     // Check if the user is already registered for the event
//     const isAlreadyRegistered =
//       existingEvent.registrations && existingEvent.registrations.includes(user._id.toString());

//     if (isAlreadyRegistered) {
//       throw 'User is already registered for this event';
//     }

//     // Register the user for the event
//     await eventCollection.updateOne(
//       { _id: existingEvent._id },
//       { $push: { registrations: user._id.toString() } }
//     );

//     // Update user's registeredEvents
//     await userCollection.updateOne(
//       { _id: new ObjectId(user._id) },
//       { $push: { registeredEvents: existingEvent._id.toString() } }
//     );

//     return { success: true, message: 'User registration successful' };
// };


// eventRegistration.function.js

export const eventRegistration = async (eventName, location, date, time, req) => {
  try {
    if (!eventName || !location || !date || !time) {
      throw 'Please provide all fields';
    }

    const eventCollection = await events();
    const userCollection = await users();
    eventName = eventName.toLowerCase();
    eventName = eventName.trim();
    location = location.toLowerCase();
    location = location.trim();


    const user = req.session.user;

    if (!user) {
      throw 'User not found in the session';
    }

    const [year, month, day] = date.split('-');
    const formattedDate = `${month}/${day}/${year}`;
    const formattedTime = new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const existingEvent = await eventCollection.findOne({
      eventName: eventName.trim(),
      location: location.trim(),
      date: formattedDate.trim(),
      time: formattedTime.trim(),
    });

    if (!existingEvent) {
      throw 'Event not found';
    }

    const isAlreadyRegistered =
      existingEvent.registrations && existingEvent.registrations.includes(user._id.toString());

    if (isAlreadyRegistered) {
      throw 'User is already registered for this event';
    }

    // Register the user for the event with a status (e.g., 'pending')
    const registration = {
      userId: user._id.toString(),
      status: 'pending',
    };

    await eventCollection.updateOne(
      { _id: existingEvent._id },
      { $push: { registrations: registration } }
    );

    // Update user's registeredEvents
    await userCollection.updateOne(
      { _id: new ObjectId(user._id) },
      { $push: { registeredEvents: { eventId: existingEvent._id.toString(), status: 'pending' } } }
    );

    return { success: true, message: 'User registration successful' };
  } catch (error) {
    return { success: false, message: error.message || 'An error occurred during registration' };
  }
};

   
// export const creditsTransfer = async (senderEmailAddress, receiverEmailAddress, numberOfCredits) => {
//   // try {
//     // Validate input fields
//     senderEmailAddress = senderEmailAddress.trim();
//     receiverEmailAddress = receiverEmailAddress.trim();

//     if (!senderEmailAddress || !receiverEmailAddress || !numberOfCredits) {
//       throw 'Please provide all fields';
//     }

//     // if(typeof senderEmailAddress !== "string" ||typeof receiverFirstName !== "string" || typeof receiverLastName !== "string" || typeof receiverEmailAddress !== "string" || typeof numberOfCredits !== "number")
//     // throw "Must provide valid fields";

//     if(typeof senderEmailAddress !== "string") throw " sender Email Address is not valid";
//     if(typeof receiverEmailAddress !== "string") throw " receiver Email Address is not valid";
//     if(typeof numberOfCredits !== "string") throw " number Of Credits is not valid";

//     if(!( /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(senderEmailAddress))){
//       throw 'Invalid sender email address'
//     }
//     if(!( /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(receiverEmailAddress))){
//       throw 'Invalid receiver email address'
//     }
//     const userCollection = await users();

//     // Retrieve the currently logged-in user from the request object
//     // const currentUser = request.user; // Update this based on your actual implementation

//     // if (!currentUser) {
//     //   throw 'Error: User not authenticated';
//     // }
    
//     // Find the sender (current user)
//     // const sender = await userCollection.findOne({ _id: senderName._id });
//     const sender = await userCollection.findOne({ emailAddress: senderEmailAddress.trim() });
// // console.log(sender);

//     if (!sender) {
//       throw "User with given sender email address not found";
//     }

//     // Check if the receiver exists
//     const receiver = await userCollection.findOne({
//       emailAddress: receiverEmailAddress.trim(),
//     });
//     console.log(receiver);
//     if (!receiver) {
//       throw 'Receiver not found';
//     }

//     if (senderEmailAddress === receiverEmailAddress) {
//       throw 'Sender and receiver email addresses cannot be the same';
//     }

//     // Check if the sender (current user) has enough credits
//     if (sender.credits < numberOfCredits) {
//       throw 'Error: Insufficient credits';
//     }
//     const numericCredits = parseInt(numberOfCredits, 10);
//     // Transfer credits
//     await userCollection.updateOne(
//       { _id: sender._id },
//       { $inc: { credits: -numericCredits } }
//     );

//     await userCollection.updateOne(
//       { _id: receiver._id },
//       { $inc: { credits: numericCredits } }
//     );

//     return { success: true, message: 'Credits transferred successfully' };
//   // } catch (error) {
//   //   return { success: false, message: error.message || 'An error occurred during credit transfer' };
//   // }  
// }

export const creditsTransfer = async (senderEmailAddress, receiverEmailAddress, numberOfCredits, currentUserEmail) => {
 
    // Validate input fields
    senderEmailAddress = senderEmailAddress.toLowerCase().trim();
    receiverEmailAddress = receiverEmailAddress.toLowerCase().trim();
    currentUserEmail = currentUserEmail.toLowerCase().trim();

    if (!senderEmailAddress || !receiverEmailAddress || !numberOfCredits) {
      throw 'Please provide all fields';
    }

    if (senderEmailAddress !== currentUserEmail) {
      throw ' Sender email address does not match the current user.';
    }

    if(senderEmailAddress === receiverEmailAddress) throw "Sender and receiver email addresses cannot be the same";

    if (typeof senderEmailAddress !== 'string' || typeof receiverEmailAddress !== 'string' || typeof numberOfCredits !== 'string') {
      throw 'Invalid input fields';
    }

    if (!( /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(senderEmailAddress))) {
      throw 'Invalid sender email address';
    }

    if (!( /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(receiverEmailAddress))) {
      throw 'Invalid receiver email address';
    }

    const userCollection = await users();

    // Find the sender (current user)
    const sender = await userCollection.findOne({ emailAddress: senderEmailAddress.trim() });

    if (!sender) {
      throw 'User with given sender email address not found';
    }

    // Check if the receiver exists
    const receiver = await userCollection.findOne({
      emailAddress: receiverEmailAddress.trim(),
    });

    if (!receiver) {
      throw 'Receiver not found';
    }

    // Check if the sender (current user) has enough credits
    if (sender.credits < numberOfCredits) {
      throw 'Sender has insufficient credits';
    }

    // Check if the receiver has insufficient credits
    // if (receiver.credits >= numberOfCredits) {
    //   throw 'Receiver has sufficient credits, transfer not allowed';
    // }

    const numericCredits = parseInt(numberOfCredits, 10);

    if (isNaN(numericCredits) || numericCredits <= 0) {
      throw 'Invalid number of credits';
    }

    // Transfer credits
    await userCollection.updateOne(
      { _id: sender._id },
      { $inc: { credits: -numericCredits } }
    );

    await userCollection.updateOne(
      { _id: receiver._id },
      { $inc: { credits: numericCredits } }
    );

    return { success: true, message: 'Credits transferred successfully'} };


    
  








    export const updateEventReview = async (emailAddress, eventName, location, date, time, rating, comments) => {
      try {
        if (!emailAddress || !eventName || !location || !date || !time) {
          throw "These fields cannot be empty!!!";
        }
    
        if (typeof emailAddress !== 'string' || emailAddress.trim().length === 0) {
          throw "emailAddress has to be a non-empty string!!!";
        }
        emailAddress = emailAddress.toLowerCase();
        eventName = eventName.toLowerCase();
        location = location.toLowerCase();
        // Format date to MM-DD-YYYY
      const [year, month, day] = date.split('-');
      date = `${month}/${day}/${year}`;

  // Format time to HH:MM AM/PM
    time = new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
    
        const ratingNumber = parseInt(rating, 10);
    
        if (isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
          throw "Invalid rating. Must be a number between 1 and 5.";
        }
    
        if (typeof comments !== 'string') {
          throw "Comments must be a string.";
        }
    
        const eventCollection = await events();
    
        // Check if the user has already provided a review for the same event
        const existingReview = await getReviewByUserAndEvent(emailAddress, eventName, location, date, time);
    
        if (existingReview) {
          throw `Review already provided for ${eventName} on ${date} at ${time}. You can edit your existing review on the 'View Profile' page.`;
        }
    
        // If no existing review, proceed to add the new review
        console.log("Updating event with query:", { eventName, location, date, time });
        const result = await eventCollection.updateOne(
          { eventName, location, date, time },
          { $push: { reviews: { emailAddress, rating: ratingNumber, comments } } }
        );
    
        if (result.modifiedCount === 0) {
          throw "Event not found. Unable to add review.";
        }
    
        console.log("Review added successfully:", { emailAddress, eventName, location, date, time, rating, comments });
    
        return { success: true };
      } catch (error) {
        console.error("Error adding review:", error);
        return { success: false, error: error.message };
      }
    };
    






export const getReviewByUserAndEvent = async (emailAddress, eventName, location, date, time) => {
    try {
      if (!emailAddress || !eventName) {
        throw "Must provide emailAddress and eventName!!";
      }
  
      // Assuming emailAddress and eventName are non-empty strings
      if (typeof emailAddress !== 'string' || emailAddress.trim().length === 0 || typeof eventName !== 'string' || eventName.trim().length === 0) {
        throw "emailAddress and eventName must be non-empty strings!!";
      }
      emailAddress = emailAddress.toLowerCase();
      eventName = eventName.toLowerCase();
  
  
      // Use await to ensure that the promise returned by getEventByName is resolved
      const event = await getEventByName(eventName);
      //console.log(event);
  
      if (!event) {
        throw "Event not found for the specified event name.";
      }
  
      if (!event.reviews || !Array.isArray(event.reviews)) {
        // No reviews found for the event
        return null;
      }
      console.log(event.reviews);
  
      // Check if a review already exists for the specified user and event
      const matchingReview = event.reviews.find(
        (review) =>
          review.emailAddress === emailAddress
          // (!location || review.location === location) 
          // (!date || review.date === date) &&
          // (!time || review.time === time)
      );
  
      return matchingReview;
    } catch (error) {
      console.error("Error in getReviewByUserAndEvent:", error);
      throw error;
    }
  };
  
  
  



  export const getReviewByUser = async (emailAddress) => {
    if (!emailAddress) {
      throw "Need to provide emailAddress!!!";
    }
  
    if (typeof emailAddress !== 'string') {
      throw "emailAddress should be a string!!";
    }
  
    emailAddress = emailAddress.trim();
    emailAddress = emailAddress.toLowerCase();
    if (emailAddress.length === 0) {
      throw "emailAddress cannot be an empty string!!";
    }
  
    const eventCollection = await events();
  
    const reviews = await eventCollection
      .find({ "reviews.emailAddress": emailAddress })
      .project({ _id: 0, reviews: { $elemMatch: { emailAddress: emailAddress } } })
      .toArray();
  
    if (reviews.length > 0) {
      return reviews[0].reviews;
    } else {
      return [];
    }
  };
  

  export const getAllReviewsByUser = async (emailAddress) => {
    if (!emailAddress) {
      throw "Need to provide emailAddress!!!";
    }
  
    if (typeof emailAddress !== 'string') {
      throw "emailAddress should be a string!!";
    }
  
    emailAddress = emailAddress.trim();
    emailAddress = emailAddress.toLowerCase();
    if (emailAddress.length === 0) {
      throw "emailAddress cannot be an empty string!!";
    }
  
    const eventCollection = await events();
  
    const reviews = await eventCollection
      .find({ "reviews.emailAddress": emailAddress })
      .project({ _id: 0, "eventName": 1, "reviews.rating": 1, "reviews.comments": 1 })
      .toArray();
  
    if (reviews.length > 0) {
      // Flatten the array of reviews and set the correct eventName
      const flattenedReviews = reviews.flatMap(review => {
        const eventName = review.eventName;
        return review.reviews.map(r => ({ eventName, ...r }));
      });
      return flattenedReviews;
    } else {
      return [];
    }
  };
// export const getAllReviewsByEventId = async(eventId) => {
//   if(!eventId){
//     throw "EventId needs to be provided!!!";
//   }
// }


// export const getAllEventsByOrganizerId = async(organizerId) => {
//   if(!organizerId){
//     throw "organizerId must be provided!!!";
//   }
// }
 

export const getAllReviewsByEventId = async (eventId) => {
    if (!eventId) {
      throw "EventId needs to be provided!!!";
    }
  
    try {
      const eventCollection = await events(); 
  
      const reviews = await eventCollection
        .find({ _id: eventId }, { projection: { _id: 0, reviews: 1 } })
        .toArray();
  
      if (reviews.length > 0) {
        return reviews[0].reviews;
      } else {
        return [];
      }
    } catch (error) {
      throw `Error fetching reviews: ${error}`;
    }
  };
  


  export const getAllEventsByOrganizerId = async (organizerId) => {
    if (!organizerId) {
      throw "organizerId must be provided!!!";
    }
  
    console.log(organizerId);
  
    try {
      const eventCollection = await events();
  
      const allevents = await eventCollection
        .find({ organizer: new ObjectId(organizerId) }, { projection: { _id: 1, eventName: 1 } })
        .toArray();
  
      return allevents;
    } catch (error) {
      throw `Error fetching allevents: ${error}`;
    }
  };






// export const deleteEvent = async (meetingId) => {
//   const eventCollection = await events();
//   const usersCollection = await users();

//   try {
//     // Find the event by ID
//     const event = await eventCollection.findOne({ _id: new ObjectId(meetingId) });

//     if (!event) {
//       throw 'Meeting not found';
//     }

//     // Check if the user is the organizer
//     // if (String(event.organizer) !== organizerId) {
//     //   throw 'Unauthorized';
//     // }

//     // Check if the meeting is scheduled in the future (use a specific field for this)

//       // Delete the event
//       await eventCollection.deleteOne({ _id: new ObjectId(meetingId) });

//       // Refund credits to the organizer
//       // await usersCollection.updateOne(
//       //   { _id: ObjectId(organizerId) },
//       //   { $inc: { credits: 1 } }
//       // );

//       return 'Meeting deleted successfully';

//   } catch (error) {
//     console.error(error);
//     throw 'Internal Server Error';
//   }
// };

export const deleteEvent = async (eventName, location, time, date, organizerId) => {
  try {
    if (!eventName || !location || !date || !time || !organizerId) {
      throw "All fields must be provided.";
    }

    if (typeof eventName !== 'string' || eventName.trim().length === 0) {
      throw "Event name must be a non-empty string.";
    }

    if (typeof location !== 'string' || location.trim().length === 0) {
      throw "Location must be a non-empty string.";
    }

    // Assume date is in the format 'YYYY-MM-DD'
    const [year, month, day] = date.split('-');
    const formattedDate = `${month}/${day}/${year}`;

    // Format time to HH:MM AM/PM
    const formattedTime = new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const eventCollection = await events();

    // Find the event by name, location, time, and date
    const event = await eventCollection.findOne({
      eventName: eventName.toLowerCase(),
      location: location.toLowerCase(),
      time: formattedTime,
      date: formattedDate,
      organizer: new ObjectId(organizerId),
    });

    if (!event) {
      throw 'Event not found.';
    }

    // Check if the user is the organizer
    if (String(event.organizer) !== organizerId) {
      throw 'Unauthorized';
    }

    // Delete the event
    await eventCollection.deleteOne({ _id: event._id });

    return 'Event deleted successfully';
  } catch (error) {
    console.error(error);
    throw 'Internal Server Error';
  }
};


export const searchEvents = async (eventName) => {
  if(!eventName){
    throw "eventName must be provided!!";
  }
  if(!(typeof eventName === 'string') || eventName.trim().length === 0){
    throw "eventName should be a non-empty string!!";
  }
  eventName = eventName.toLowerCase();
  const eventCollection = await events();
  const searchedEvent = await eventCollection.findOne({
    eventName
  });
  return searchedEvent;
}
