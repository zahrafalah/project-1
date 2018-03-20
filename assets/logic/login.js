
var clientID='Hv6x2ZbdqnFmcWVm';
var queryURL = "http://api.eventful.com/json/events/search?...&location=";
var tag;

var loginState="loggedOut";
var userName;
var pinCode;
var addDate;
var userLocation;

function getEventfulEvents(userLocation)
{
    var oArgs = {
    app_key: clientID,
    category: "family_fun_kids",
    where: userLocation, 
    "date": "future", 
    page_size: 25,
    sort_order: "popularity"
  }
  EVDB.API.call("/events/search", oArgs, function(results) {
  // Note: this relies on the custom toString() methods below
  console.log(results);
 // makeEventCards(results);
  });
}

function makeEventCards(results){
  console.log("made it to make event cards");
  console.log(results);

}

$("#welcome").on("submit",function(event){
  event.preventDefault();
  userLocation = $("#startText").val().toString();
  console.log(userLocation);
  window.open("tempSecondPage.html","_self");
  $("#currentLoc").html('Currently Searching:'+userLocation);
  getEventfulEvents(userLocation);

})

$("#addTerm").on("submit",function(event){
  event.preventDefault();
  userLocation = $("#startText").val();
  window.open("tempSecondPage.html","_self");
  $("#currentLoc").html('Currently Searching:'+userLocation);
  getEventfulEvents();

})

$("#welcome").on("submit",function(event){
  event.preventDefault();
  userLocation = $("#startText").val();
  window.open("tempSecondPage.html","_self");
  $("#currentLoc").html('Currently Searching:'+userLocation);
  getEventfulEvents();

})

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAqqFDGVm6pNyj_skReV42OfQEXyG3G5iM",
    authDomain: "logintest-2d079.firebaseapp.com",
    databaseURL: "https://logintest-2d079.firebaseio.com",
    projectId: "logintest-2d079",
    storageBucket: "logintest-2d079.appspot.com",
    messagingSenderId: "72723334125"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

console.log("db connection successful");

//add new user to the database//

$("#add-user-btn").on("click", function(event) {
  event.preventDefault();

  // Get user input
  var userName = $("#username-input").val().trim();
  var pinCode = $("#pin-input").val().trim();
  var addDate = moment().format("MM/DD/YYYY");
  var loginState = "loggedIn";

  // Create local temp object for holding new user data
  var newUser = {
    userName: userName,
    pinCode: pinCode,
    addDate: addDate,  
    loginState : loginState 
  };
  //user input validation

  
  //check database for duplicate user name
  database.ref("/users/"+userName).once("value").then(function(response) {
    if(response.val()!==null) {
      $("#usernameError").text("That user name is already taken. Please choose another.");
    }
    else if (pinCode.length < 4) {
      $("#pinError").text("Your PIN must be at least 4 characters.");
      $("#pin-input").val("");
    }
    else {
      // Upload new user record to the database
      database.ref("users/" + userName).set(newUser);
  
      //DO SOMETHING ELSE - REPLACE THE LOGIN FORM WITH THE USER'S SAVED ITEMS OR WHATEVER
    }
  });
  

  // Logs everything to console
  console.log(newUser.userName);
  console.log(newUser.pinCode);
  console.log(addDate);
  

  // Alert
 // alert("Welcome to Unborable!");


  
});



//user login - check the database for 

$("#login-btn").on("click", function(event) {
    event.preventDefault();
  
    // Get user input
    var userName = $("#login-username").val().trim();
    var pinCode = $("#login-pin").val().trim().toString();
    console.log("un"+userName);
  
    // get back pincode from database where record equals userName input value from the form
    
    database.ref("/users/"+userName).once("value").then(function(snapshot) {
        console.log("un"+userName);
        var userRecord = snapshot.val();
        console.log(snapshot.val());
    //    var userNm = snapshot.child("users").userName;
        var key = snapshot.child.key;
        var resultPinCode=snapshot.child("pinCode").val().toString();

        console.log("pinCode: "+resultPinCode);
        console.log("pincode input: " +pinCode);
        if (resultPinCode==pinCode) {

          console.log("match");
          $("#loginError").text("That's a match! Welcome back.");
          loginState="loggedIn";
    //      $("#loginError").text("");
          console.log("usernm/userstate: " + userName, loginState)
          //NEXT--DO SOMETHING - QUERY THE DATABASE AND RETURN THE USER'S SAVED ITEMS 
          //FOR EACH ITEM IN RESULT SET, APPEND AN 'EVENT INFO CARD' object TO THE INTO THE SAVED ITEMS SECTION
          
           
        }
        else {
             $("#loginError").text("That User ID/PIN combo does not match any in our records. Try again.");
             $("#login-pin").text("");
            loginState="notLoggedIn";
            console.log("usernm/userstate: " + userName, loginState)

        };

    });
    
    
});
  //log out function - NOT SURE WE NEED THIS REALLY

  // $("#logout-btn").on("click", function(event) {
  //   console.log(userName);
  //   event.preventDefault();
    
  //   var update = {
     
  //     loginState : "loggedOut"
  //   };
  //   database.ref("/users/"+userName).update(update);
  // });



    //user input validation
  
    
  
    // Clears all of the text-boxes
    $("#username-input").val("");
    $("#pin-input").val("");
    $("#pinError").text("");
    $("#login-username").val("");
    $("#login-pin").val("");
    $("#loginError").text("");
   
 
  
