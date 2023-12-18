import * as usersData from './data/users.js';

try{
    console.log(await usersData.createUser("Chandini","Rayaduragm", "crayadur1@stevens.edu", "password@123","user"));
}catch(e){
    console.log(e);
}

try{
    console.log(await usersData.createUser("monika","parsa", "mparsa@stevens.edu", "password@12345","admin"));
}catch(e){
    console.log(e);
}

try{
    console.log(await usersData.checkUser("crayadur1@stevens.edu","password@123"));
}catch(e){
    console.log(e);
}

try{
    console.log(await usersData.createEvent(20,"12/19/2023",3,"Babbio","10:30 PM","MeetSmart","crayadur1@stevens.edu"));
}catch(e){
    console.log(e);
}


try{
    console.log(await usersData.getallevents());
}catch(e){
    console.log(e);
}

try{
    console.log(await usersData.getEventByName("MeetSmart"));
}catch(e){
    console.log(e);
}

try{
    console.log(await usersData.getallusers());
}catch(e){
    console.log(e);
}

try{
    console.log(await usersData.getUserById("6579081423ecc900d2285410"));
}catch(e){
    console.log(e);
}

try{
    console.log(await usersData.updateUser("Chandu","Rayadur","crayadur2@stevens.edu","Password@123","admin"));
}catch(e){
    console.log(e);
}

try{
    console.log(await usersData.getEventByDetails("MeetSmart","Babbio","10:30 PM","12/19/2023"));
}catch(e){
    console.log(e);
}

try{
    console.log(await usersData.eventRegistration("MeetSmart","Babbio","12/19/2023","10:30 PM"));
}catch(e){
    console.log(e);
}

try{
    console.log(await usersData.creditsTransfer("crayadur2@stevens.edu","mparsa@stevens.edu",20,"crayadur2@stevens.edu"));
}catch(e){
    console.log(e);
}

try{
    console.log(await usersData.updateEventReview("crayadur2@stevens.edu","MeetSmart","Babbio","12/19/2023","10:30 PM","3 - Good","webproject is done!!"));
}catch(e){
    console.log(e);
}


try{
    console.log(await usersData.getReviewByUserAndEvent("crayadur2@stevens.edu","MeetSmart","Babbio","12/19/2023","10:30 PM"));
}catch(e){
    console.log(e);
}

try{
    console.log(await usersData.getReviewByUser("crayadur2@stevens.edu"));
}catch(e){
    console.log(e);
}

try{
    console.log(await usersData.getAllReviewsByUser("crayadur2@stevens.edu"));
}catch(e){
    console.log(e);
}

try{
    console.log(await usersData.getAllReviewsByEventId("657f9f732143dded4d354043"));
}catch(e){
    console.log(e);
}

try{
    console.log(await usersData.getAllEventsByOrganizerId("6579081423ecc900d2285410"));
}catch(e){
    console.log(e);
}


try{
    console.log(await usersData.deleteEvent("MeetSmart","Babbio","10:30 PM","12/19/2023"));
}catch(e){
    console.log(e);
}

try{
    console.log(await usersData.searchEvents("MeetSmart"));
}catch(e){
    console.log(e);
}























