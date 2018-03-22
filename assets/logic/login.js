
var clientID='Hv6x2ZbdqnFmcWVm';
var queryURL = "http://api.eventful.com/json/events/search?...&location=";
var tag;

var loginState="loggedOut";
var userName;
var pinCode;
var addDate;
var userLocation;
var resultSet=[];
var resultItems=[];
var pagenumber = 1;
var oArgs = {
  app_key: clientID,
  category: "family_fun_kids",
  where: userLocation, 
  "date": "future", 
  page_size: 25,
  page_number:pagenumber,
  sort_order: "popularity"
}




// function getEventsFunction(_callback){
//   getEventfulEvents();
//   _callback();
// }

function getEventfulEvents(pagenumber)
{
  console.log("userloc: "+userLocation);
    
  EVDB.API.call("/events/search", oArgs, function(results) {
  // Note: this relies on the custom toString() methods below
  console.log(results);
  resultSet=results;
  makeEventCards();
  
  
  });
}
//enhancement -- 'get next 25 events' button
function getNext25(){
  resultItems=[]; //clear resultItems array
  $("#cardHolder").clear(); //clear cardHolder section
  pagenumber++; //increase pagenumber 
  getEventfulEvents(pagenumber); //get new events
}

function makeEventCards(){
  console.log("made it to make event cards");
  console.log(resultSet.events.event[0]);
  //for each item in the result set, make an item that we can use and push it into a temporary array
  //called resultItems. we can then use these items to create the cards, push to the user's saved items, etc
  //we can reference the item in the array by the unique 'id' value
  for (var i=0;i<resultSet.events.event.length;i++){
    var resultItem = resultSet.events.event[i]; 
    var eventItem = {
      id:resultItem.id,
      title:resultItem.title,
      address:resultItem.venueAddress,
      city:resultItem.city_name,
      state:resultItem.region_abbr,
      zip:resultItem.postal_code,
      startTime=resultItem.startTime,
      venue:resultItem.venue_name,
      venueURL:resultItem.venue_url,
      imageURL:resultItem.image.medium.url,
      description:resultItem.description,
      latitude : resultItem.latitude,
      longitude : resultItem.longitude
    };
    resultItems.push(eventItem);
    console.log(eventItem);
    var newCard = $("<div>");
    var removeLink = $("<a/>");
    removeLink.attr("class","removeLink");
    removeLink.text("Remove Me");
    newCard.append(removeLink);
    newCard.attr("class","eventCard col-md-8");
    newCard.attr("id",eventItem.id);//unique id we can use to reference this object
    newCard.html("Event Name:"+eventItem.title+"<br> Event description:"+eventItem.description+"<br><br>----------------------<br>")
    $("#cardHolder").append(newCard);

  }//end for loop

}

$(document).on("dblclick",".eventCard",function(){
  
  var id=$(this).attr("id");
  console.log("removing ID: ",id);
  var itemIndex = findInArray(resultItems,"id",id);
      resultItems.splice(itemIndex,1);//remove item from resultItems array
      $(this).remove();
  console.log("new resultItems count",resultItems.length);
})

function findInArray(array,attribute,value){
  for (var i = 0;i<array.length;i++){
    if(array[i][attribute]==value) {
      return i;
    }
  }
    return -1; //else
}
function removeMe(element) 
    {
      $(element).remove();//remove the entire div
    }

$("#startButton").on("click",function(event){
  event.preventDefault();
  userLocation = $("#startText").val().toString();
  console.log(userLocation);
  getEventfulEvents(pagenumber);//
 // getEventfulEvents();
//   window.open("tempSecondPage.html","_self");
  // $("#currentLoc").html('Currently Searching:'+userLocation);
  
  //change the page around - clear out the divs, set up for user to use
//  makeEventCards(resultSet);

});

// $("#addTerm").on("submit",function(event){
//   event.preventDefault();
//   userLocation = $("#startText").val();
//   window.open("tempSecondPage.html","_self");
//   $("#currentLoc").html('Currently Searching:'+userLocation);
//   getEventfulEvents(userLocation);

// })

// $("#welcome").on("submit",function(event){
//   event.preventDefault();
//   userLocation = $("#startText").val();
//   // window.open("tempSecondPage.html","_self");
//   // $("#currentLoc").html('Currently Searching:'+userLocation);
//   getEventfulEvents();


// })

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
    loginState : loginState,
    savedEvents:[
      {
        eventID:"",
        location:"",
        title:"",
        imageURLsmall:""
      }
    ] 
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
   
 
  
