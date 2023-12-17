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
  emailAddress = emailAddress.toLowerCase();
  if(!( /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailAddress))){
    throw 'Error: Invalid email address'
  }
  const userCollection= await users();
  let user = await userCollection.findOne({emailAddress})
  if(user){
      throw 'there is already a user with that email address'
    }

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
  let newUser={
    firstName: firstName,
    lastName: lastName,
    emailAddress: emailAddress,
    password: hash,
    role: role,
    credits:100,
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

// export const createEvent = async (
//   organizer,
//   capacity,
//       date,
//       duration,
//       location,
//       time,
//       eventName,
// ) => {
//   if( !organizer|| !date|| !duration|| !location|| !time|| !eventName|| !capacity){
//     throw 'Error: Must provide all fields'
//   }

//   const eventCollection= await events();
//   const userCollection= await users();
//   let newEvent={
//     organizer: organizer,
//     capacity: capacity,
//     date: date,
//     duration: duration,
//     location:location,
//     time:time,
//     eventName:eventName,
//   }
  
//   const savedMeeting = await eventCollection.insertOne(newEvent);
//   // const updatedUser = await userCollection.findByIdAndUpdate(
//   //   organizer,
//   //   { $inc: { credits: -1 } }, // Assuming each meeting costs 1 credit
//   //   { new: true }
//   // );

//   res.status(201).json({ meeting: savedMeeting, user: updatedUser });
// console.log("Created the New Event with id ",organizer)
//   if (!insertInfo.acknowledged || !insertInfo.insertedId)
//     throw 'Could not add band'
//   let obj={insertedUser: true};
//   return obj;
// };




export const createEvent = async (
  organizerName,
  capacity,
  date,
  duration,
  location,
  time,
  eventName,
) => {
  if (!organizerName || !date || !duration || !location || !time || !eventName || !capacity) {
    throw 'Error: Must provide all fields';
  }

  organizerName = organizerName.toLowerCase();
  //eventName = eventName.toLowerCase();
  location = location.toLowerCase();

  
  

  const eventCollection = await events();
  const usersCollection = await users();

  // Fetch the user's _id based on the organizerName
  const user = await usersCollection.findOne({ firstName: organizerName });
  if (!user) {
    throw `User with name ${organizerName} not found`;
  }

  let newEvent = {
    organizer: new ObjectId(user._id),
    capacity: capacity,
    date: date,
    duration: duration,
    location: location,
    time: time,
    eventName: eventName.toLowerCase(),
  };

  const insertInfo = await eventCollection.insertOne(newEvent);

  console.log("Created the New Event with id ", newEvent.organizer);

  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw 'Could not add event';
  }

  // Update user's credits
  await usersCollection.updateOne(
    { _id: new ObjectId(newEvent.organizer) },
    { $inc: { credits: -1 } }
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

  //const userId = "6576af98cedbabfb701d7a10"; // Example ID 

// try {

//   const updatedUser = await updateUser(
//     "Chandini", 
//     "Rayadur",
//     "crayadur2@stevens.edu",
//     "Muni@6699",  
//     "user"
//   );

//   console.log(updatedUser);

// } catch (e) {
//   console.log(e); 
// }

// export const updateEventReview = async (eventName, location, date, time, rating, comments) => {
//   try {
//     if (!eventName || !location || !date || !time) {
//       throw "These fields cannot be empty!!!";
//     }

//     if (typeof eventName !== 'string' || eventName.trim().length === 0) {
//       throw "eventName has to be a non-empty string!!!";
//     }

//     if (typeof location !== 'string' || location.trim().length === 0) {
//       throw "location cannot be an empty string!!!";
//     }

//     // Extract the numeric part from the rating input (e.g., "4 - Very Good" -> 4)
//     const ratingNumber = parseInt(rating, 10);

//     // Check if the extracted rating is a valid number between 1 and 5
//     if (isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
//       throw "Invalid rating. Must be a number between 1 and 5.";
//     }

//     if (typeof comments !== 'string') {
//       throw "Comments must be a string.";
//     }

//     const eventCollection = await events();
    
//     await eventCollection.updateOne(
//       { eventName, location, date, time },
//       { $push: { reviews: { rating: ratingNumber, comments } } }
//     );

//     return { success: true };
//   } catch (error) {
//     return { success: false, error: error.message };
//   }
// };




// export const getReviewByUserAndEvent = async (userId, eventName, location, date, time) => {
//   try {
//     if (!userId || !eventName || !location || !date || !time) {
//       throw "Must provide userId, eventName, location, date, and time!!";
//     }

//     if (typeof userId !== 'string' || userId.trim().length === 0) {
//       throw "userId must be a non-empty string!!";
//     }

//     if (typeof eventName !== 'string' || eventName.trim().length === 0) {
//       throw "eventName must be a non-empty string!!";
//     }

//     if (typeof location !== 'string' || location.trim().length === 0) {
//       throw "location must be a non-empty string!!";
//     }

//     if (typeof date !== 'string' || date.trim().length === 0) {
//       throw "date must be a non-empty string!!";
//     }

//     if (typeof time !== 'string' || time.trim().length === 0) {
//       throw "time must be a non-empty string!!";
//     }

//     const event = await getEventByName(eventName);

//     const review = event.reviews.find(
//       (review) =>
//         review.userId === userId &&
//         review.location === location &&
//         review.date === date &&
//         review.time === time
//     );

//     return review;
//   } catch (error) {
//     throw error;
//   }
// };

// export const getReviewByUser = async (userId) => {

//   if(!userId){
//     throw "Need to provide userID!!!";
//   }

//   if (typeof id !== 'string'){
//     throw "userId should be a string!!";
//   }

//   userId = userId.trim();
//   if (userId.length === 0){
//     throw "userId cannot be empty string!!";
//   }

//   if (!ObjectId.isValid(userId)){
//     throw "Not a valid ID!!";
//   }
//   const eventCollection = await events();
  
//   const reviews = await eventCollection
//     .find({ "reviews.userId": userId })
//     .project({ _id: 0, reviews: { $elemMatch: { userId: userId } } })
//     .toArray();

//   if (reviews.length > 0) {
//     return reviews[0].reviews; 
//   } else {
//     return []; 
//   }
// };

// export const updateEventReview = async (emailAddress, eventName, location, date, time, rating, comments) => {
//   try {
//     if (!emailAddress || !eventName || !location || !date || !time) {
//       throw "These fields cannot be empty!!!";
//     }

//     // Assuming emailAddress is a non-empty string
//     if (typeof emailAddress !== 'string' || emailAddress.trim().length === 0) {
//       throw "emailAddress has to be a non-empty string!!!";
//     }

//     const ratingNumber = parseInt(rating, 10);

//     if (isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
//       throw "Invalid rating. Must be a number between 1 and 5.";
//     }

//     if (typeof comments !== 'string') {
//       throw "Comments must be a string.";
//     }

//     const eventCollection = await events();

//     // Check if the user has already submitted a review for the specified event
//     const existingReview = await getReviewByUserAndEvent(emailAddress, eventName, location, date, time);

//     if (existingReview) {
//       throw `Review already provided for ${eventName} on ${date} at ${time}. You can edit your existing review on the 'View User' page.`;
//     }

//     await eventCollection.updateOne(
//       { eventName, location, date, time },
//       { $push: { reviews: { emailAddress, rating: ratingNumber, comments } } }
//     );

//     console.log("Review added successfully:", { emailAddress, eventName, location, date, time, rating, comments });

//     return { success: true };
//   } catch (error) {
//     console.error("Error adding review:", error);
//     return { success: false, error: error.message };
//   }
// };

export const updateEventReview = async (emailAddress, eventName, location, date, time, rating, comments) => {
  try {
    if (!emailAddress || !eventName || !location || !date || !time) {
      throw "These fields cannot be empty!!!";
    }

    // Assuming emailAddress is a non-empty string
    if (typeof emailAddress !== 'string' || emailAddress.trim().length === 0) {
      throw "emailAddress has to be a non-empty string!!!";
    }
    emailAddress = emailAddress.toLowerCase();
    eventName = eventName.toLowerCase();
    location = location.toLowerCase();



    const ratingNumber = parseInt(rating, 10);

    if (isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
      throw "Invalid rating. Must be a number between 1 and 5.";
    }

    if (typeof comments !== 'string') {
      throw "Comments must be a string.";
    }

    // Check if the user has already provided a review for the same event
    const existingReview = await getReviewByUserAndEvent(emailAddress, eventName, location, date, time);

    if (existingReview) {
      throw `Review already provided for ${eventName} on ${date} at ${time}. You can edit your existing review on the 'View Profile' page.`;
    }

    // If no existing review, proceed to add the new review
    const eventCollection = await events();

    await eventCollection.updateOne(
      { eventName, location, date, time },
      { $push: { reviews: { emailAddress, rating: ratingNumber, comments } } }
    );

    console.log("Review added successfully:", { emailAddress, eventName, location, date, time, rating, comments });

    return { success: true };
  } catch (error) {
    console.error("Error adding review:", error);
    return { success: false, error: error.message };
  }
};




// export const getReviewByUserAndEvent = async (emailAddress, eventName, location, date, time) => {
//   try {
//     if (!emailAddress || !eventName) {
//       throw "Must provide emailAddress and eventName!!";
//     }

//     // Assuming emailAddress and eventName are non-empty strings
//     if (typeof emailAddress !== 'string' || emailAddress.trim().length === 0 || typeof eventName !== 'string' || eventName.trim().length === 0) {
//       throw "emailAddress and eventName must be non-empty strings!!";
//     }

//     const event = await getEventByName(eventName);

//     if (!event) {
//       throw "Event not found for the specified event name.";
//     }

//     if (!event.reviews || !Array.isArray(event.reviews)) {
//       return null;
//     }

//     const matchingReviews = event.reviews.filter(
//       (review) =>
//         review.emailAddress === emailAddress &&
//         (!location || review.location === location) &&
//         (!date || review.date === date) &&
//         (!time || review.time === time)
//     );
    
//     if (!matchingReviews.length) {
//       // Instead of throwing an error, return null:
//       return null;
//     }

//     // Assuming you want to return only the first matching review
//     return matchingReviews[0];
//   } catch (error) {
//     console.error("Error in getReviewByUserAndEvent:", error);
//     throw error;
//   }
// };

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





