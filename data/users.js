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
    eventName: eventName,
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

  // export const eventRegistration = async (eventName, location, date, time) => {
  //   if (!eventName || !location || !date || !time) {
  //     throw 'Error: Must provide event information';
  //   }
  
  //   const eventCollection = await events();
  //   const userCollection = await users();
  
  //   const eventsRegistration = await eventCollection.findOne({eventName});
  //   return eventsRegistration;
  // };


  // export const eventRegistration = async (eventName, location, date, time) => {
  //   if (!eventName || !location || !date || !time) {
  //     throw 'Error: Must provide event information';
  //   }
  
  //   const eventCollection = await events();
  // console.log(eventName);
  // console.log(location);
  // console.log(date);
  // console.log(time);
  //   // Check if the event exists
  //   const existingEvent = await eventCollection.findOne({
  //     eventName: eventName.trim(),
  //     // location: location.trim(),
  //     // date: date.trim(),
  //     // time: time.trim(),
  //   });
  // console.log(existingEvent);
  //   if (!existingEvent) {
  //     throw 'No event found with the given details';
  //   }
  
  //   // Assuming you have a way to get the current user's ID
  //   const userId = getCurrentUserId(); // Implement this function to get the user ID
  
  //   // Check if the user is already registered for the event
  //   const isAlreadyRegistered = existingEvent.registrations && existingEvent.registrations.includes(userId);
  
  //   if (isAlreadyRegistered) {
  //     throw 'User is already registered for this event';
  //   }
  
  //   // Register the user for the event
  //   await eventCollection.updateOne(
  //     { _id: existingEvent._id },
  //     { $push: { registrations: userId } }
  //   );
  
  //   return { message: 'User registration successful' };
  // };
  

  
  // export const eventRegistration = async (eventName, location, date, time, userFirstName, userLastName, userEmailAddress) => {
  //   if (!eventName || !location || !date || !time || !userFirstName || !userLastName || !userEmailAddress) {
  //     throw 'Error: Must provide event and user information';
  //   }
  
  //   const eventCollection = await events();
  //   const userCollection = await users();
  
  //   // Find the event based on the provided details
  //   const existingEvent = await eventCollection.findOne({
  //     eventName: eventName.trim(),
  //     location: location.trim(),
  //     date: date.trim(),
  //     time: time.trim(),
  //   });
  
  //   // Check if the event exists
  //   if (!existingEvent) {
  //     throw 'No event found with the given details';
  //   }
  
  //   // Save additional user information to the user collection
  //   const result = await userCollection.insertOne({
  //     firstName: userFirstName,
  //     lastName: userLastName,
  //     emailAddress: userEmailAddress,
  //     // Add other user-related fields as needed
  //   });
  
  //   if (result.insertedCount !== 1) {
  //     throw 'Error: User registration failed';
  //   }
  
  //   // Register the user for the event
  //   await eventCollection.updateOne(
  //     { _id: existingEvent._id },
  //     { $push: { registrations: result.insertedId } }
  //   );
  
  //   return { message: 'User registration successful' };
  // };


  export const eventRegistration = async (eventName, location, date, time, userFirstName, userLastName, userEmailAddress) => {
    try {
      // Validate input fields
      if (!eventName || !location || !date || !time || !userFirstName || !userLastName || !userEmailAddress) {
        throw 'Error: Must provide all fields';
      }
  
      const eventCollection = await events();
      const userCollection = await users();
  
      // Check if the event exists
      const existingEvent = await eventCollection.findOne({ 
      eventName: eventName.trim(),
      location: location.trim(),
      date: date.trim(),
      time: time.trim(),
       });
      if (!existingEvent) {
        throw 'Error: Event not found';
      }
  
      // Check if the user exists
      const existingUser = await userCollection.findOne({ emailAddress: userEmailAddress });
      if (!existingUser) {
        throw 'Error: User not found';
      }
  
      // Check if the user is already registered for the event
      const isAlreadyRegistered = existingEvent.registrations && existingEvent.registrations.includes(existingUser._id.toString());
      if (isAlreadyRegistered) {
        throw 'Error: User is already registered for this event';
      }
  
      // Register the user for the event
      await eventCollection.updateOne(
        { _id: existingEvent._id },
        { $push: { registrations: existingUser._id.toString() } }
      );
  
      return { success: true, message: 'User registration successful' };
  } catch (error) {
    return { success: false, message: error.message || 'An error occurred during registration' };
  }
  };

// export const creditsTransfer = async (senderEmailAddress, receiverFirstName, receiverLastName, receiverEmailAddress, numberOfCredits) => {
//   // try {
//     // Validate input fields
//     senderEmailAddress = senderEmailAddress.trim();
//     receiverFirstName = receiverFirstName.trim();
//     receiverLastName = receiverLastName.trim();
//     receiverEmailAddress = receiverEmailAddress.trim();

//     if (!senderEmailAddress || !receiverFirstName || !receiverLastName || !receiverEmailAddress || !numberOfCredits) {
//       throw 'Please provide all fields';
//     }

//     // if(typeof senderEmailAddress !== "string" ||typeof receiverFirstName !== "string" || typeof receiverLastName !== "string" || typeof receiverEmailAddress !== "string" || typeof numberOfCredits !== "number")
//     // throw "Must provide valid fields";

//     if(typeof senderEmailAddress !== "string") throw " sender Email Address is not valid";
//     if(typeof receiverFirstName !== "string") throw " receiver First Name is not valid";
//     if(typeof receiverLastName !== "string") throw " receiver Last Name is not valid";
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
//       firstName: receiverFirstName.trim(),
//       lastName: receiverLastName.trim(),
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
   
export const creditsTransfer = async (senderEmailAddress, receiverEmailAddress, numberOfCredits) => {
  // try {
    // Validate input fields
    senderEmailAddress = senderEmailAddress.trim();
    receiverEmailAddress = receiverEmailAddress.trim();

    if (!senderEmailAddress || !receiverEmailAddress || !numberOfCredits) {
      throw 'Please provide all fields';
    }

    // if(typeof senderEmailAddress !== "string" ||typeof receiverFirstName !== "string" || typeof receiverLastName !== "string" || typeof receiverEmailAddress !== "string" || typeof numberOfCredits !== "number")
    // throw "Must provide valid fields";

    if(typeof senderEmailAddress !== "string") throw " sender Email Address is not valid";
    if(typeof receiverEmailAddress !== "string") throw " receiver Email Address is not valid";
    if(typeof numberOfCredits !== "string") throw " number Of Credits is not valid";

    if(!( /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(senderEmailAddress))){
      throw 'Invalid sender email address'
    }
    if(!( /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(receiverEmailAddress))){
      throw 'Invalid receiver email address'
    }
    const userCollection = await users();

    // Retrieve the currently logged-in user from the request object
    // const currentUser = request.user; // Update this based on your actual implementation

    // if (!currentUser) {
    //   throw 'Error: User not authenticated';
    // }
    
    // Find the sender (current user)
    // const sender = await userCollection.findOne({ _id: senderName._id });
    const sender = await userCollection.findOne({ emailAddress: senderEmailAddress.trim() });
// console.log(sender);

    if (!sender) {
      throw "User with given sender email address not found";
    }

    // Check if the receiver exists
    const receiver = await userCollection.findOne({
      emailAddress: receiverEmailAddress.trim(),
    });
    console.log(receiver);
    if (!receiver) {
      throw 'Receiver not found';
    }

    if (senderEmailAddress === receiverEmailAddress) {
      throw 'Sender and receiver email addresses cannot be the same';
    }

    // Check if the sender (current user) has enough credits
    if (sender.credits < numberOfCredits) {
      throw 'Error: Insufficient credits';
    }
    const numericCredits = parseInt(numberOfCredits, 10);
    // Transfer credits
    await userCollection.updateOne(
      { _id: sender._id },
      { $inc: { credits: -numericCredits } }
    );

    await userCollection.updateOne(
      { _id: receiver._id },
      { $inc: { credits: numericCredits } }
    );

    return { success: true, message: 'Credits transferred successfully' };
  // } catch (error) {
  //   return { success: false, message: error.message || 'An error occurred during credit transfer' };
  // }  
}