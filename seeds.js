import * as usersData from './data/users.js';

// try{
//     console.log(await usersData.getEventByName("WebProject"));
// }catch(e){
//     console.log(e);
// }

// try{
//     console.log(await usersData.updateEventReview("crayadur@stevens.edu","Projectmeet","Babbio","2023-12-09","19:35","3 - Good","webproject is done!!"));
// }catch(e){
//     console.log(e);
// }

// try{
//     console.log(await usersData.getEventByName("Projectmeet"));
// }catch(e){
//     console.log(e);
// }

// try{
//     console.log(await usersData.getReviewByUserAndEvent("Projectmeet"));
// }catch(e){
//     console.log(e);
// }

// try{
//     console.log(await usersData.getReviewByUserAndEvent("crayadur@stevens.edu","multi variant TA hours","South gateway","2023-12-12","22:30"));
// }catch(e){
//     console.log(e);
// }


// try{
//     console.log(await usersData.getAllEventsByOrganizerId("6579081423ecc900d2285410"));
// }catch(e){
//     console.log(e);
// }import * as usersData from './data/users.js';

// try{
//     console.log(await usersData.eventRegistration("Aaku Pooja", "Howe 203", "11:11 AM", "12/18/2023"));
// }catch(e){
//     console.log(e);
// }


// try{
//     console.log(await usersData.updateEventReview("crayadur@stevens.edu","cpt","Babbio","2023-12-19","22:30","3 - Good","webproject is done!!"));
// }catch(e){
//     console.log(e);
// }
try {
  const newUser = await usersData.createUser(
    'John',
    'Doe',
    'john.doe@stevens.edu',
    'Password123!',
    'user'
  );
  console.log('New user created:', newUser);
} catch (error) {
  console.error('Error creating a new user:', error);
}


try {
  const newUser = await usersData.createUser('', 'Doe', '', 'Password123!', 'user');
  console.log('New user created:', newUser);
} catch (error) {
  console.error('Error creating a new user:', error);
}


try {
  const user = await usersData.checkUser('john.doe@example.com', 'Password123!');
  console.log('User credentials checked:', user);
} catch (error) {
  console.error('Error checking user credentials:', error);
}


try {
  const user = await usersData.checkUser('john.doe@example.com', 'InvalidPassword');
  console.log('User credentials checked:', user);
} catch (error) {
  console.error('Error checking user credentials:', error);
}


try {
  const newEvent = await usersData.createEvent(
    50,
    '2023-12-20',
    2,
    'Babbio',
    '19:30',
    'Sample Event',
    'john.doe@example.com'
  );
  console.log('New event created:', newEvent);
} catch (error) {
  console.error('Error creating a new event:', error);
}


try {
  const newEvent = await usersData.createEvent(
    50,
    '2023-12-10', 
    2,
    'Babbio',
    '19:30',
    'Sample Event',
    'john.doe@example.com'
  );
  console.log('New event created:', newEvent);
} catch (error) {
  console.error('Error creating a new event:', error);
}


try {
  const transferResult = await usersData.creditsTransfer(
    'john.doe@example.com',
    'receiver@example.com',
    '10',
    'john.doe@example.com'
  );
  console.log('Credits transferred successfully:', transferResult);
} catch (error) {
  console.error('Error transferring credits:', error);
}


try {
  const transferResult = await usersData.creditsTransfer(
    'john.doe@example.com',
    'receiver@example.com',
    '1000',
    'john.doe@example.com'
  );
  console.log('Credits transferred successfully:', transferResult);
} catch (error) {
  console.error('Error transferring credits:', error);
}

// Add more test cases for creditsTransfer...

// Test case 9: Get all events
try {
  const allEvents = await usersData.getallevents();
  console.log('All events:', allEvents);
} catch (error) {
  console.error('Error fetching all events:', error);
}

// Test case 10: Get event by name
try {
  const eventName = 'Sample Event';
  const event = await usersData.getEventByName(eventName);
  console.log(`Event with name '${eventName}':`, event);
} catch (error) {
  console.error(`Error fetching event with name '${eventName}':`, error);
}

// Add more test cases for other functions...

// Test case 11: Event registration
try {
  const registrationResult = await usersData.eventRegistration(
    'Sample Event',
    'Babbio',
    '2023-12-20',
    '19:30',
    { session: { user: { emailAddress: 'john.doe@example.com' } } }
  );
  console.log('Event registration result:', registrationResult);
} catch (error) {
  console.error('Error registering for an event:', error);
}

// Test case 12: Event registration with invalid event details
try {
  const registrationResult = await usersData.eventRegistration(
    'Invalid Event',
    'Babbio',
    '2023-12-20',
    '19:30',
    { session: { user: { emailAddress: 'john.doe@example.com' } } }
  );
  console.log('Event registration result:', registrationResult);
} catch (error) {
  console.error('Error registering for an event:', error);
}

// Add more test cases for eventRegistration...

// Test case 13: Deleting an event
try {
  const eventIdToDelete = 'your_event_id_here';
  const deletionResult = await usersData.deleteEvent(eventIdToDelete);
  console.log('Event deletion result:', deletionResult);
} catch (error) {
  console.error('Error deleting an event:', error);
}


try{
    console.log(await usersData.deleteEvent("cpt","Babbio","10:30 PM","12/19/2023"));
}catch(e){
    console.log(e);
}
