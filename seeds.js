import * as usersData from './data/users.js';

try{
    console.log(await usersData.creditsTransfer("pipsyjangidi@stevens.edu", "Pranitha", "Jangidi", "pnambiar@stevens.edu", 5));
}catch(e){
    console.log(e);
}