
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
var pageNumber = 1;

var eventUserName;

var oArgs = {
  app_key: clientID,
  category: "family_fun_kids",
  where: "", 
  "date": "future", 
  page_size: 25,
  page_number:pageNumber,
  sort_order: "popularity"
}



function getEventfulEvents(){
  oArgs.where=userLocation; //set location for query arguments
  EVDB.API.call("/events/search", oArgs, function(results) {
  // Note: this relies on the custom toString() methods below
  resultSet = results;
  makeEventCards();
  });
}

//function to expand the description preview (seeMore class) if the user clicks on it

$(document).on("click",".seeMore",function(){
  var targetEventID=$(this).parent().attr("id");
  var targetIndex=findInArray(resultItems,"id",targetEventID);
  var fullDescription = resultItems[targetIndex].description;
  $(this).html(fullDescription);
});

function makeEventCards(){
  console.log("made it to make event cards");
  console.log(resultSet.events.event[0]);
  //for each event item in the result set, make an item that we can use and push it into a temporary array
  //called resultItems. we can then use these items to create the cards, push to the user's saved items, etc
  //we can reference the item in the array by the unique 'id' value
  for (var i=0;i<resultSet.events.event.length;i++){
    var resultItem = resultSet.events.event[i]; 

    var startDate = moment(resultItem.start_time).format("ddd MM/DD/YYYY");
    var startsAt = moment(resultItem.start_time).format("h:mm A");

    if(resultItem.description==null){      //error handling for NULL event description - just makes the 
      var eventDesc=resultItem.title;   //description match the event title instead of displaying "null"
    }
    else var eventDesc=resultItem.description;

    if (eventDesc.length>=151)
    {var desc_preview=eventDesc.substring(0,151)+"...";} //if the description is long, grab the first 150 characters of the description
    else {var desc_preview= eventDesc }; //otherwise, just show the description
    var eventItem = {
      id:resultItem.id,
      title:resultItem.title,
      address:resultItem.venue_address,
      city:resultItem.city_name,
      state:resultItem.region_abbr,
      zip:resultItem.postal_code,
      startTime:startsAt,
      startDate:startDate,
      daysUntil: moment().diff(moment(resultItem.start_time), "days") === 0? "Happening TODAY!!": Math.abs(moment().diff(moment(resultItem.start_time), "days")),
      venue:resultItem.venue_name,
      venueURL:resultItem.venue_url,
      imageURL:resultItem.image.medium.url,
      description:resultItem.eventDesc,
      descriptionPreview:resultItem.desc_preview,
      latitude : parseFloat(resultItem.latitude),
      longitude : parseFloat(resultItem.longitude)
    };
    resultItems.push(eventItem); //push item into temp array

    var newCard = $("<div>");
    newCard.addClass("card w-90");
    
    var newRow = $("<div>");
    newRow.addClass("row");

    var imgDivContainer = $("<div>");
    imgDivContainer.addClass("col-md-3");
    var theImage = $("<img>");
    theImage.addClass("card-img");
    theImage.attr("alt",eventItem.desc_preview);
    theImage.attr("src",eventItem.imageURL);
    theImage.attr("id","s" + eventItem.id);
    imgDivContainer.append(theImage);

    var cardDivContainer = $("<div>");
    cardDivContainer.addClass("col-md-7");
    var cardBody = $("<div>");
    cardBody.addClass ("card-body");
    var h5 = $("<h5>");
    h5.addClass("card-title");
    h5.text(eventItem.title);
    var p = $("<p>");
    p.addClass("card-text");
    p.text(eventItem.eventDesc);
    
    var aCard = $("<a>"); 
    aCard.addClass("card-link");
    aCard.attr("href",eventItem.venue_url);
    aCard.text(eventItem.venue_name);
    
    var divAddr = $("<div>"); 
    divAddr.attr("id", "m"+eventItem.eventID);
    divAddr.addClass("gmap");
    divAddr.html(eventItem.address + "<br/>" + eventItem.city + " , " + eventItem.state);
    divAddr.data("data-lng", eventItem.longitude);
    divAddr.data("data-lat", eventItem.latitude);
    divAddr.data("data-addr", eventItem.address);

    cardBody.append(h5);
    cardBody.append(p);
    cardBody.append(aCard);
    cardBody.append(divAddr);
     
    cardDivContainer.append(cardBody);
    
    var iconDivContainer = $("<div>");
    iconDivContainer.addClass("col-md-2");
    var iconDiv = $("<div>");
    iconDiv.addClass("icon");
    var iconA = $("<a>");
    iconA.attr("id", "a" + eventItem.id );
    iconA.addClass("saveLink");
    iconA.addClass("coverr-nav-item");
    iconA.css("text-decoration", "none");
    iconA.attr("href", "#coverrs");
    var iconH1 = $("<h1>");
    //iconH1.addClass("text-white");
    var iconI = $("<i>");
    iconI.addClass("fas");
    iconI.addClass("fa-star");

    iconH1.append(iconI);
    iconA.append(iconH1);
    iconDiv.append(iconA);
    iconDivContainer.append(iconDiv);

    newRow.append(imgDivContainer);
    newRow.append(cardDivContainer);
    newRow.append(iconDivContainer);

    newCard.append(newRow);

    /*
    var newCard = $("<div>");
    var removeLink = $("<a/>");
    removeLink.attr("class","removeLink");
    removeLink.text("Not Interested");
    var saveEventLink = $("<a/>");
    saveEventLink.attr("class","saveLink");
    saveEventLink.text("Save this one!");
    newCard.attr("class","eventCard col-md-8");
    newCard.attr("id",eventItem.id);//unique id we can use to reference this object
    newCard.html("<br>-----------------------------------------------<br>Event Name:"+eventItem.title+"<br>Event description:<span class='seeMore' title='click to see more'>"+eventItem.descriptionPreview+"</span><br> Location: "+eventItem.city+", "+eventItem.state+"<br> Date & Time: "+eventItem.startDate+"  "+eventItem.startTime+"<br>" + "<br> Days from Now "+eventItem.daysUntil+"<br>")
    newCard.append(removeLink);
    newCard.append("<br>");
    newCard.append(saveEventLink);

    
    var gMap = $('<div>');
    gMap.addClass("mapCanvas");

     
    var gElementID = "m" + eventItem.id;
    gLongitude = parseFloat(eventItem.longitude);
    gLatitude = parseFloat(eventItem.latitude);
    gMap.attr("id", gElementID);
    $("#cardHolder").append(gMap);

    console.log(gLatitude, gLongitude, gElementID);
    initMap(gLatitude, gLongitude);
    newCard.append(gMap);
    */
    $("#cardHolder").append(newCard);



    
   
     
   

  }//end for loop
  // add 'next 25 button'
  //i meant for this button to display at the end of the list of events, but it is
  //showing at the top
    var nextButton = $("<button>")
    nextButton.attr("id","getNext")
    nextButton.attr("class","btn btn-lg");
    nextButton.text("Get Next 25 Events");

    $("#cardHolder").append(nextButton);

}







//make the 'not interested' link do something

$(document).on("click",".removeLink",function(){
  
  var id=$(this).parent().attr("id");
  console.log("removing ID: ",id);
  var itemIndex = findInArray(resultItems,"id",id);
      resultItems.splice(itemIndex,1);//remove item from resultItems array
      $(this).parent().remove();
  console.log("new resultItems count",resultItems.length);


});


//bookmark event item

$('#cardHolder').on("click",".saveLink",function(){
  //check to see if user is logged in - if not, remindAboutSigningUp()
  //if user is logged in, proceed:
  alert("hear me");
  var id=$(this).parent().attr("id");
  console.log("saving ID: ",id);
  var itemIndex = findInArray(resultItems,"id",id);
  //var saveObject = resultItems[i];
  //push saveObject to users/saveditems

  
  //move $(this).parent() to 'saved items' section (top right)
  console.log("new resultItems count",resultItems.length);

   // Push the updated events to the database
    //Note we are rewriting each time to resolve index issue
    console.log(resultItems);
    database.ref("users/"+ eventUserName + "/savedEvents").set(resultItems);

});


//function to find the position of an object in an array based on the value of
//one of its attributes

function findInArray(array,attribute,value){
  for (var i = 0;i<array.length;i++){
    if(array[i][attribute]==value) {
      return i;
    }
  }
    return -1; //else
}

//removes the element passed into the function

function removeMe(element) 
    {
      $(element).remove();//remove the entire element
    }


$("#searchButton").on("click",function(event){
  
  event.preventDefault();
  userLocation = $("#inputSearch").val().toString();
  console.log(userLocation);
  getEventfulEvents();//

});




//enhancement - allow the user to add additional keywords to their search - requires a text input field 
//called 'keywordText' and a button id 'addTerm'
// $("#addTerm").on("click",function(event){
//   event.preventDefault();
//   searchTerm = $("#keywordText").val();
//   oArgs.keywords = searchTerm;
//   getEventfulEvents();
// }

//enhancement -- 'get next 25 events' button
$(document).on("click","#getNext",function(){
  resultItems=[]; //clear resultItems array
  $("#cardHolder").empty(); //clear cardHolder section
  pageNumber++;//increase pageNumber 
  console.log("new page#: ",pageNumber);
  oArgs.page_number=pageNumber; //set new page number in query arguments
  console.log("new oargs: ",oArgs);
  getEventfulEvents();

});

function getNext(){
  resultItems=[]; //clear resultItems array
  $("#cardHolder").clear(); //clear cardHolder section
  pageNumber++;//increase pageNumber 
  oArgs.page_number=pageNumber; //set new page number in query arguments
  getEventfulEvents(); //get new events
}



//~~~~~~~~~~~~~~~~~~~~~~~~~database stuff ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

  // Initialize Firebase
  /*
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
*/


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB_wkzEKhJEretzMVr731-Lu75fwAfKv7E",
    authDomain: "project-1-635d0.firebaseapp.com",
    databaseURL: "https://project-1-635d0.firebaseio.com",
    projectId: "project-1-635d0",
    storageBucket: "",
    messagingSenderId: "89864333225"
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
  
  eventUserName = newUser.userName;

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
          console.log("usernm/userstate: " + userName, loginState);

          //NEXT--DO SOMETHING - QUERY THE DATABASE AND RETURN THE USER'S SAVED ITEMS 
          eventUserName = userName;
          //FOR EACH ITEM IN RESULT SET, APPEND AN 'EVENT INFO CARD' object TO THE INTO THE SAVED ITEMS SECTION
          //1. Retrieve the event info
          
          var refEvent = database.ref("/users/" + eventUserName + "/savedEvents/");
          refEvent.on("value", function(snapshot) {
            console.log("The array length is " + snapshot.val().length);
            var cardsArray = snapshot.val();
            console.log(cardsArray);

            for (var i=0;i<cardsArray.length;i++){
              var resultItem = cardsArray[i]; 
          
              
          
              if(resultItem.description==null){      //error handling for NULL event description - just makes the 
                var eventDesc=resultItem.title;   //description match the event title instead of displaying "null"
              }
              else var eventDesc=resultItem.description;
          
              var eventItem = {
                id:resultItem.id,
                title:resultItem.title,
                address: '',
                //address:resultItem.venueAddress,
                city:resultItem.city_name,
                state:resultItem.region_abbr,
                zip:resultItem.postal_code,
                startTime:resultItem.start_time,
                daysUntil: moment().diff(moment(resultItem.start_time), "days") === 0? "Happening TODAY!!": Math.abs(moment().diff(moment(resultItem.start_time), "days")),

                venue:resultItem.venue_name,
                venueURL:resultItem.venue_url,
               // imageURL:resultItem.image.medium.url,
                description:eventDesc,
                latitude : resultItem.latitude,
                longitude : resultItem.longitude
              };
              resultItems.push(eventItem); //push item into temp array
              console.log(eventItem);
              console.log("User Name is " + eventUserName);
              var newCard = $("<div>");
              var removeLink = $("<a/>");
              removeLink.attr("class","removeLink");
              removeLink.text("Not Interested");
              var saveEventLink = $("<a/>");
              saveEventLink.attr("class","saveLink");
              saveEventLink.text("Save this one!");
              newCard.attr("class","eventCard col-md-8");
              newCard.attr("id",eventItem.id);//unique id we can use to reference this object
              newCard.html("<br>-----------------------------------------------<br>Event Name:"+eventItem.title+"<br> Event description:"+eventItem.description+"<br> Location: "+eventItem.city+", "+eventItem.state+"<br> Start Time: "+eventItem.startTime+"<br>"  + "<br> Days from Now: "+eventItem.daysUntil+"<br>")
              newCard.append(removeLink);
              newCard.append("<br>");
              newCard.append(saveEventLink);
              
              
              
              var gMap = $('<div>');
              gMap.addClass("mapCanvas");

               
              var gElementID = "m" + eventItem.id;
              gLongitude = parseFloat(eventItem.longitude);
              gLatitude = parseFloat(eventItem.latitude);
              gMap.attr("id", gElementID);
              $("#cardHolder").append(gMap);

              console.log(gLatitude, gLongitude, gElementID);
              initMap(gElementID, gLatitude, gLongitude);
              newCard.append(gMap);
              $("#cardHolder").append(newCard);
               
            }//end for loop
          


     
          }, function (error) {
            console.log("Error: " + error.code);
          });
          
           
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
   
 //double click the basic event card to remove it (already deprecated with 'not interested link' lol)

// $(document).on("dblclick",".eventCard",function(){
  
//   var id=$(this).attr("id");
//   console.log("removing ID: ",id);
//   var itemIndex = findInArray(resultItems,"id",id);
//       resultItems.splice(itemIndex,1);//remove item from resultItems array
//       $(this).remove();
//   console.log("new resultItems count",resultItems.length);
// });
 
function initMap() {
  // Create a map object and specify the DOM element for display.
  alert('initialCall');
  var map = new google.maps.Map(document.getElementById('mapCanvas'), {
    center: {lat: -34.397, lng: 150.644},
    scrollwheel: false,
    zoom: 8
  });
}


function initMap(gLatitude, gLongitude, gAddress) {
  // Create a map object and specify the DOM element for display.
  
  var mapTitle = gAddress;
  var map = new google.maps.Map(document.getElementById('mapCanvas'), {
    center: {lat: gLatitude, lng: gLongitude},
    scrollwheel: false,
    zoom: 18
  });

  var marker = new google.maps.Marker({
    position: {lat: gLatitude, lng: gLongitude},
    map: map,
    title: mapTitle
  });


}


$('#cardHolder').on('click','.gmap', function(){
   initMap($(this).data("data-lat"), $(this).data("data-lng"), $(this).data("data-addr"))
});
