// In this file, you must perform all client-side validation for every single form input (and the role dropdown) on your pages. The constraints for those fields are the same as they are for the data functions and routes. Using client-side JS, you will intercept the form's submit event when the form is submitted and If there is an error in the user's input or they are missing fields, you will not allow the form to submit to the server and will display an error on the page to the user informing them of what was incorrect or missing.  You must do this for ALL fields for the register form as well as the login form. If the form being submitted has all valid data, then you will allow it to submit to the server for processing. Don't forget to check that password and confirm password match on the registration form!

let emailAddressInput = document.getElementById('emailAddressInput');
let passwordInput = document.getElementById('passwordInput');
let loginForm = document.getElementById('login-form');
let registrationForm = document.getElementById('registration-form');
let edituserForm = document.getElementById('edituser-form');
let firstNameInput = document.getElementById('firstNameInput');
let lastNameInput = document.getElementById('lastNameInput');
let confirmPasswordInput = document.getElementById('confirmPasswordInput');
let roleInput = document.getElementById('roleInput');

let newemailAddressInput = document.getElementById('newemailAddressInput');
let newpasswordInput = document.getElementById('newpasswordInput');
let newfirstNameInput = document.getElementById('newfirstNameInput');
let newlastNameInput = document.getElementById('newlastNameInput');
let newconfirmPasswordInput = document.getElementById('newconfirmPasswordInput');
let newroleInput = document.getElementById('newroleInput');

let FeedbackForm = document.getElementById('feedback-form');

let loginEmailError = document.getElementById('no-email');
let loginPasswordError = document.getElementById('no-pass');
let regPassConfirmError = document.getElementById('no-pass-confirm');
let regRoleError = document.getElementById('no-role');
let regFnameError = document.getElementById('no-fname');
let regLnameError = document.getElementById('no-lname');


if(loginForm){
    loginForm.addEventListener('submit',(event)=>{
        event.preventDefault();
        if(emailAddressInput && passwordInput){
            loginEmailError.hidden = true;
            loginPasswordError.hidden = true;
            loginForm.submit();
        }else if(!emailAddressInput && passwordInput){
            loginEmailError.hidden = false;
            loginPasswordError.hidden = true;
        }else if(emailAddressInput && !passwordInput){
            loginEmailError.hidden = true;
            loginPasswordError.hidden = false;    
        }else{
            loginEmailError.hidden = false;
            loginPasswordError.hidden = false;
        }
    })
}

if(registrationForm){
    registrationForm.addEventListener('submit',(event)=>{
        event.preventDefault();
        if(emailAddressInput && passwordInput && firstNameInput && lastNameInput && confirmPasswordInput && roleInput){
            loginEmailError.hidden = true;
            loginPasswordError.hidden = true;
            regPassConfirmError.hidden = true;
            regFnameError.hidden = true;
            regLnameError.hidden = true;
            regRoleError.hidden = true;

            registrationForm.submit();
        }else if(!firstNameInput){
            loginEmailError.hidden = true;
            loginPasswordError.hidden = true;
            regPassConfirmError.hidden = true;
            regFnameError.hidden = false;
            regLnameError.hidden = true;
            regRoleError.hidden = true;
        }else if(!lastNameInput){
            loginEmailError.hidden = true;
            loginPasswordError.hidden = true;
            regPassConfirmError.hidden = true;
            regFnameError.hidden = true;
            regLnameError.hidden = false;
            regRoleError.hidden = true;   
        }else if(!emailAddressInput){
            loginEmailError.hidden = false;
            loginPasswordError.hidden = true;
            regPassConfirmError.hidden = true;
            regFnameError.hidden = true;
            regLnameError.hidden = true;
            regRoleError.hidden = true;   
        }else if(!passwordInput){
            loginEmailError.hidden = true;
            loginPasswordError.hidden = false;
            regPassConfirmError.hidden = true;
            regFnameError.hidden = true;
            regLnameError.hidden = true;
            regRoleError.hidden = true;   
        }else if(!confirmPasswordInput){
            loginEmailError.hidden = true;
            loginPasswordError.hidden = true;
            regPassConfirmError.hidden = false;
            regFnameError.hidden = true;
            regLnameError.hidden = true;
            regRoleError.hidden = true;   
        }else{
            loginEmailError.hidden = true;
            loginPasswordError.hidden = true;
            regPassConfirmError.hidden = true;
            regFnameError.hidden = true;
            regLnameError.hidden = true;
            regRoleError.hidden = false;
        }
    })
}

if(edituserForm){
    edituserForm.addEventListener('submit',(event)=>{
        event.preventDefault();
        if(newemailAddressInput && newpasswordInput && newfirstNameInput && newlastNameInput && newconfirmPasswordInput && newroleInput){
            loginEmailError.hidden = true;
            loginPasswordError.hidden = true;
            regPassConfirmError.hidden = true;
            regFnameError.hidden = true;
            regLnameError.hidden = true;
            regRoleError.hidden = true;

            edituserForm.submit();
        }else if(!newfirstNameInput){
            loginEmailError.hidden = true;
            loginPasswordError.hidden = true;
            regPassConfirmError.hidden = true;
            regFnameError.hidden = false;
            regLnameError.hidden = true;
            regRoleError.hidden = true;
        }else if(!newlastNameInput){
            loginEmailError.hidden = true;
            loginPasswordError.hidden = true;
            regPassConfirmError.hidden = true;
            regFnameError.hidden = true;
            regLnameError.hidden = false;
            regRoleError.hidden = true;   
        }else if(!newemailAddressInput){
            loginEmailError.hidden = false;
            loginPasswordError.hidden = true;
            regPassConfirmError.hidden = true;
            regFnameError.hidden = true;
            regLnameError.hidden = true;
            regRoleError.hidden = true;   
        }else if(!newpasswordInput){
            loginEmailError.hidden = true;
            loginPasswordError.hidden = false;
            regPassConfirmError.hidden = true;
            regFnameError.hidden = true;
            regLnameError.hidden = true;
            regRoleError.hidden = true;   
        }else if(!newconfirmPasswordInput){
            loginEmailError.hidden = true;
            loginPasswordError.hidden = true;
            regPassConfirmError.hidden = false;
            regFnameError.hidden = true;
            regLnameError.hidden = true;
            regRoleError.hidden = true;   
        }else{
            loginEmailError.hidden = true;
            loginPasswordError.hidden = true;
            regPassConfirmError.hidden = true;
            regFnameError.hidden = true;
            regLnameError.hidden = true;
            regRoleError.hidden = false;
        }
    })
}


if(FeedbackForm){
    edituserForm.addEventListener('submit',(event)=>{
        event.preventDefault();
        if(newemailAddressInput && newpasswordInput && newfirstNameInput && newlastNameInput && newconfirmPasswordInput && newroleInput){
            loginEmailError.hidden = true;
            loginPasswordError.hidden = true;
            regPassConfirmError.hidden = true;
            regFnameError.hidden = true;
            regLnameError.hidden = true;
            regRoleError.hidden = true;

            edituserForm.submit();
        }else if(!newfirstNameInput){
            loginEmailError.hidden = true;
            loginPasswordError.hidden = true;
            regPassConfirmError.hidden = true;
            regFnameError.hidden = false;
            regLnameError.hidden = true;
            regRoleError.hidden = true;
        }else if(!newlastNameInput){
            loginEmailError.hidden = true;
            loginPasswordError.hidden = true;
            regPassConfirmError.hidden = true;
            regFnameError.hidden = true;
            regLnameError.hidden = false;
            regRoleError.hidden = true;   
        }else if(!newemailAddressInput){
            loginEmailError.hidden = false;
            loginPasswordError.hidden = true;
            regPassConfirmError.hidden = true;
            regFnameError.hidden = true;
            regLnameError.hidden = true;
            regRoleError.hidden = true;   
        }else if(!newpasswordInput){
            loginEmailError.hidden = true;
            loginPasswordError.hidden = false;
            regPassConfirmError.hidden = true;
            regFnameError.hidden = true;
            regLnameError.hidden = true;
            regRoleError.hidden = true;   
        }else if(!newconfirmPasswordInput){
            loginEmailError.hidden = true;
            loginPasswordError.hidden = true;
            regPassConfirmError.hidden = false;
            regFnameError.hidden = true;
            regLnameError.hidden = true;
            regRoleError.hidden = true;   
        }else{
            loginEmailError.hidden = true;
            loginPasswordError.hidden = true;
            regPassConfirmError.hidden = true;
            regFnameError.hidden = true;
            regLnameError.hidden = true;
            regRoleError.hidden = false;
        }
    })
}


const eventNameInput = document.getElementById('eventName');
const locationInput = document.getElementById('location');
const dateInput = document.getElementById('date');
const timeInput = document.getElementById('time');
const ratingInput = document.getElementById('rating');
const commentsInput = document.getElementById('comments');

const eventNameError = document.getElementById('no-eventName');
const locationError = document.getElementById('no-location');
const dateError = document.getElementById('no-date');
const ratingError = document.getElementById('no-rating');
const commentsError = document.getElementById('no-comments');

if (FeedbackForm) {
  FeedbackForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Reset all error messages
    eventNameError.hidden = true;
    locationError.hidden = true;
    dateError.hidden = true;
    ratingError.hidden = true;
    commentsError.hidden = true;

    if (
      eventNameInput.value &&
      locationInput.value &&
      dateInput.value &&
      timeInput.value &&
      ratingInput.value &&
      commentsInput.value
    ) {
      FeedbackForm.submit();
    } else {
      if (!eventNameInput.value) {
        eventNameError.hidden = false;
      }
      if (!locationInput.value) {
        locationError.hidden = false;
      }
      if (!dateInput.value) {
        dateError.hidden = false;
      }
      if (!ratingInput.value) {
        ratingError.hidden = false;
      }
      if (!commentsInput.value) {
        commentsError.hidden = false;
      }
    }
  })
}

