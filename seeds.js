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


try{
    console.log(await usersData.updateEventReview("crayadur@stevens.edu","cpt","Babbio","2023-12-19","22:30","3 - Good","webproject is done!!"));
}catch(e){
    console.log(e);
}