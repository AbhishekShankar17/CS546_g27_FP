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

