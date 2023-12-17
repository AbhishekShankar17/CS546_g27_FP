import * as usersData from './data/users.js';

try{
    console.log(await usersData.eventRegistration("Aaku Pooja", "Howe 203", "11:11 AM", "12/18/2023"));
}catch(e){
    console.log(e);
}