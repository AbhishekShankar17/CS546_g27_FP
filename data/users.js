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

    // Format date to MM-DD-YYYY
    const [year, month, day] = date.split('-');
    const formattedDate = `${month}/${day}/${year}`;

  // Format time to HH:MM AM/PM
  const formattedTime = new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  let newEvent = {
    organizer: new ObjectId(user._id),
    capacity: capacity,
    date: formattedDate,
    duration: duration,
    location: location,
    time: formattedTime,
    eventName: eventName,
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
    senderEmailAddress = senderEmailAddress.trim();
    receiverEmailAddress = receiverEmailAddress.trim();

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
    if (receiver.credits >= numberOfCredits) {
      throw 'Receiver has sufficient credits, transfer not allowed';
    }

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

    return { success: true, message: 'Credits transferred successfully' };
  
};

export const deleteUserById = async (id) => {
  if (!id) throw 'You must provide an id';

  const usersCollection = await users();

  const result = await usersCollection.deleteOne({
    _id: new ObjectId(id),
  });

  if (result.deletedCount === 1) {
    return { success: true, message: 'User deleted successfully' };
  } else {
    throw 'User not found or deletion failed';
  }
};

// try {
//   const userIdToDelete = '657ea9995c4ca863d14499cd'; // Replace with the actual user ID
//   const deleteResult = await deleteUserById(userIdToDelete);

//   console.log(deleteResult.success
//     ? 'User deleted successfully'
//     : 'User not found or deletion failed'
//   );
// } catch (error) {
//   console.error('Error:', error);
// }



export const deleteEventById = async (id) => {
  if (!id) throw 'You must provide an id';

  const usersCollection = await users();

  const result = await usersCollection.deleteOne({
    _id: new ObjectId(id),
  });

  if (result.deletedCount === 1) {
    return { success: true, message: 'Event deleted successfully' };
  } else {
    throw 'User not found or deletion failed';
  }
};

// try {
//     const userIdToDelete = '657e99f6e1011466f145a5de'; // Replace with the actual user ID
//     const deleteResult = await deleteEventById(userIdToDelete);
  
//     console.log(deleteResult.success
//       ? 'User deleted successfully'
//       : 'User not found or deletion failed'
//     );
//   } catch (error) {
//     console.error('Error:', error);
//   }
  



  // try {
  //   const usersList = await getallusers();
  //   console.log('Users List:', usersList);
  // } catch (error) {
  //   console.error('Error:', error);
  // }

// try {
//   const eventsList = await getallevents();
//   console.log('Events List:', eventsList);
// } catch (error) {
//   console.error('Error:', error);
// }

export const deleteAllEvents = async () => {
  const eventsCollection = await events();

  try {
    const deleteResult = await eventsCollection.deleteMany({});
    const deletedCount = deleteResult.deletedCount;

    if (deletedCount > 0) {
      return { success: true, message: `Deleted ${deletedCount} events` };
    } else {
      return { success: true, message: 'No events found to delete' };
    }
  } catch (error) {
    throw `Error deleting events: ${error}`;
  }
};

// try {
//   const deleteResult = await deleteAllEvents();
//   console.log(deleteResult);
// } catch (error) {
//   console.error('Error:', error);
// }

export const deleteAllUsers = async () => {
  const usersCollection = await users();

  try {
    // First, delete the associated events
     await deleteAllEvents();

    // Now, delete the users
    const deleteResult = await usersCollection.deleteMany({});
    const deletedCount = deleteResult.deletedCount;

    if (deletedCount > 0) {
      return { success: true, message: `Deleted ${deletedCount} users and associated events` };
    } else {
      return { success: true, message: 'No users found to delete' };
    }
  } catch (error) {
    throw `Error deleting users and associated events: ${error}`;
  }
};

// try {
//   const deleteResult = await deleteAllUsers();
//   console.log(deleteResult);
// } catch (error) {
//   console.error('Error:', error);
// }
