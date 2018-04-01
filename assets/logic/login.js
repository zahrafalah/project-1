//Global variables
var clientID='Hv6x2ZbdqnFmcWVm';
var queryURL = "http://api.eventful.com/json/events/search?...&location=";
var tag;
var loggedIn = "false";
var userName;
var pinCode;
var addDate;
var userLocation;
var resultSet=[];
var resultItems=[];
var pageNumber = 1;
var eventUserName;

//default argument object for Eventful API
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
  //Create the event cards
  console.log(resultSet);
  makeEventCards(resultSet);
  });
}

//function to expand the description preview (seeMore class) if the user clicks on it
//Need to restore this functionality
$('#cardHolder').on("click",".seeMore",function(){
  var targetEventID=$(this).data("data-index");
  var targetIndex=findInArray(resultItems,"id",targetEventID);
  var fullDescription = resultItems[targetIndex].description;
  $(this).html(fullDescription);
});

$('#favoriteHolder').on("click",".seeMore",function(){
  var targetEventID=$(this).data("data-index");
  var targetIndex=findInArray(resultItems,"id",targetEventID);
  var fullDescription = resultItems[targetIndex].description;
  $(this).html(fullDescription);
});


function makeEventCards(eventSet){
  //for each event item in the result set, make an item that we can use and push it into a temporary array
  //called resultItems. we can then use these items to create the cards, push to the user's saved items, etc
  //we can reference the item in the array by the unique 'id' value
  for (var i=0;i<eventSet.events.event.length;i++){
    var resultItem = eventSet.events.event[i]; 
    var startDate = moment(resultItem.start_time).format("ddd MM/DD/YYYY");
    var startsAt = moment(resultItem.start_time).format("h:mm A");

    
    var eventItem = createEvent(resultItem);
    resultItems.push(eventItem); //push item into temp array
    buildCard(eventItem,$("#cardHolder"));
   
  }//end for loop
  // add 'next 25 button'
    var nextButton = $("<button>")
    nextButton.attr("id","getNext")
    nextButton.attr("class","btn btn-lg");
    nextButton.text("Get Next 25 Events");

    $("#cardHolder").append(nextButton);
    
  // Move down page
    location.hash = "#navbarTogglerDemo02";
}

function loadEventCards(eventSet){
 
  //for each event item in the result set, make an item that we can use and push it into a temporary array
  //called resultItems. we can then use these items to create the cards, push to the user's saved items, etc
  //we can reference the item in the array by the unique 'id' value
  for (var i=0;i<eventSet.length;i++){
    var resultItem = eventSet[i]; 

    //var startDate = moment(resultItem.start_time).format("ddd MM/DD/YYYY");
    //var startsAt = moment(resultItem.start_time).format("h:mm A");
    console.log(resultItem);
    var eventItem = loadEvent(resultItem);
        resultItems.push(eventItem); //push item into temp array
    
     
    buildCard(eventItem,$("#favoriteHolder"));
    console.log(eventItem);
    // tweetCardInfo(eventItem);

  }//end for loop
  // add 'next 25 button'
  //i meant for this button to display at the end of the list of events, but it is
  //showing at the top
  $("#favoriteHolder").css("visibility","visible");
  $("#signinForm").css("display","none");
  
    var nextButton = $("<button>")
    nextButton.attr("id","getNext")
    nextButton.attr("class","btn btn-lg");
    nextButton.text("Get Next 25 Events");
  //Place at beginning of favorites 
  $("#favoriteHolder").append(nextButton);

}
function tweetCardInfo(eventItem) {
  console.log("this one also");
  // var cardInfo = eventItem.title;
  console.log(eventItem);
  // var twitterURL = "https://twitter.com/intent/tweet?text=" + CardInfo;
  // var CardInfo = $("#card").text();          
  // var tweetBtn = $('<a></a>').addClass('twitter-share-button').attr('href', 'http://twitter.com/share').attr('data-url', eventItem.imageURL).attr('data-text',eventItem.title);
  // console.log(tweetBtn);
  // $('.card-body').append(tweetBtn);
  // twttr.widgets.load();
}
// tweetCardInfo();

//delegate listener to cardholder container
$('#cardHolder').on("click",".removeLink",function(){
  var id=$(this).data("data-parentid");
 
  var itemIndex = findInArray(resultItems,"id",id);
      resultItems.splice(itemIndex,1);//remove item from resultItems array
      $("#"+id).remove(); 
 
});

//delegate listener to favorites card holder
$('#favoriteHolder').on("click",".removeLink",function(){
  var id=$(this).data("data-parentid");
    var itemIndex = findInArray(resultItems,"id",id);
      resultItems.splice(itemIndex,1);//remove item from resultItems array
      $("#"+id).remove(); 
});



//delegate listener to card holder

$('#cardHolder').on("click",".saveLink",function(){
  //check to see if user is logged in - if not, remindAboutSigningUp()
  //if user is logged in, proceed:
  if($("#signinForm").css("display") === "none"){
       //var id=$(this).parent().attr("id");
       if($('#favoriteHolder').css("visibility") === "hidden"){
        $('#favoriteHolder').css("visibility","visible");
      }
      var id=$(this).data("data-parentid");
      $("#favoriteHolder").prepend($('#' + id));
      
      var itemIndex = findInArray(resultItems,"id",id);

      //Overwrite database object      
        database.ref("users/"+ eventUserName + "/savedEvents").set(resultItems);
    
    
  }
  
   
 
  
      
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
  window.location.hash = "searchContainer";
  userLocation = $("#inputSearch").val().toString();
  
  getEventfulEvents();//

});

$("#changeLocation").on("click", function(event){
  event.preventDefault();
  window.location.hash = "searchContainer";
  userLocation = $("#inputSearch").val().toString();
  $('#cardHolder').empty();
  getEventfulEvents();
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
  
  oArgs.page_number=pageNumber; //set new page number in query arguments
 
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
      //$("#usernameError").text("That user name is already taken. Please choose another.");
      var key = response.child.key;
      var resultPinCode=response.child("pinCode").val().toString();
      
      if (resultPinCode==pinCode) {
        loginState="loggedIn";
         
      }
      var refEvent = database.ref("/users/" + eventUserName + "/savedEvents/");
      refEvent.on("value", function(snapshot){
        
        var cardsArray = snapshot.val();
        console.log("Cards array");
        console.log(cardsArray); 
         
        loadEventCards(cardsArray);
      });
        

        }
    else if (pinCode.length < 4) {
      $("#pinError").text("Your PIN must be at least 4 characters.");
      $("#pin-input").val("");
    }
    else {
      //if we are going to add a user, hide the signin form, show
      //the favorites div and put a welcome message
      // Upload new user record to the database
      $("#signinForm").hide();
      $("#favoriteHolder").show();
      // $("#favoriteHolder").html("Welcome to Unborable! You can now click the Star on any item to save it.")
        
      database.ref("users/" + userName).set(newUser);
  
      //DO SOMETHING ELSE - REPLACE THE LOGIN FORM WITH THE USER'S SAVED ITEMS OR WHATEVER
      
    }
  });
  

  // Logs everything to console
 
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
    
  
    // get back pincode from database where record equals userName input value from the form
    
    database.ref("/users/"+userName).once("value").then(function(snapshot) {
         
        var userRecord = snapshot.val();
         
    //    var userNm = snapshot.child("users").userName;
        var key = snapshot.child.key;
        var resultPinCode=snapshot.child("pinCode").val().toString();

         
        if (resultPinCode==pinCode) {

           
          $("#loginError").text("That's a match! Welcome back.");
          loginState="loggedIn";
    //      $("#loginError").text("");
          

          //NEXT--DO SOMETHING - QUERY THE DATABASE AND RETURN THE USER'S SAVED ITEMS 
          eventUserName = userName;
          //FOR EACH ITEM IN RESULT SET, APPEND AN 'EVENT INFO CARD' object TO THE INTO THE SAVED ITEMS SECTION
          //1. Retrieve the event info
          
          var refEvent = database.ref("/users/" + eventUserName + "/savedEvents/");
          refEvent.on("value", function(snapshot) {
             
            var cardsArray = snapshot.val();
             

             
            makeEventCards(cardsArray);

             
            
          }, function (error) {
             
          });
        }
        else {
             $("#loginError").text("That User ID/PIN combo does not match any in our records. Try again.");
             $("#login-pin").text("");
            loginState="notLoggedIn";
             

        };

    });
    
    
});
  // Clears all of the text-boxes
  $("#username-input").val("");
  $("#pin-input").val("");
  $("#pinError").text("");
  $("#login-username").val("");
  $("#login-pin").val("");
  $("#loginError").text("");
   

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


$('#favoriteHolder').on('click','.gmap', function(){
  initMap($(this).data("data-lat"), $(this).data("data-lng"), $(this).data("data-addr"))
});

function buildCard(eventItem, divContainer){
 // Create a new card 
 var newCard = $("<div>");
 newCard.addClass("card w-90");
 newCard.attr("id", eventItem.id);
 //Append the row to the card
 newCard.append(buildNewRow(eventItem));
 // Attach the new card
 divContainer.prepend(newCard);
}

function buildNewRow(eventItem){
 //Create a new row 
 var newRow = $("<div>");
 newRow.addClass("row");

 newRow.append(buildImageContainer(eventItem));
 newRow.append(buildCardContainer(eventItem));
 newRow.append(buildIconContainer(eventItem));
 
 return newRow;
}


function buildImageContainer(eventItem){
  var imgDivContainer = $("<div>");
  imgDivContainer.addClass("col-md-3");
  var theImage = $("<img>");
  theImage.addClass("card-img");
  theImage.attr("alt",eventItem.desc_preview);
  theImage.attr("src",eventItem.imageURL);
  theImage.attr("id","s" + eventItem.id);
  return imgDivContainer.append(theImage);

}

function buildCardContainer(eventItem){
  var cardDivContainer = $("<div>");
  cardDivContainer.addClass("col-md-7");
  var cardBody = $("<div>");
  cardBody.addClass ("card-body col-md-12");
  var h5 = $("<h3>");
  h5.addClass("card-title");
  h5.text(eventItem.title);
  var h4=$("<h4>");
  h4.html("Date: " + eventItem.startDate + "<br/>"  + " Time " + eventItem.startTime + "<br/>" + " Days Until: " + eventItem.daysUntil );

  var p = $("<p>");
  p.addClass("card-text");
  p.html(eventItem.descriptionPreview);
  p.data("data-index", eventItem.id);
    
  eventItem.description.length >150 ? p.addClass("seeMore"):'';
    
  var aCard = $("<a>"); 
  aCard.addClass("card-link");
  aCard.attr("href",eventItem.venue_url);
  aCard.text(eventItem.venue_name);
    
  var divAddr = $("<div>"); 
  divAddr.attr("id", "m"+eventItem.eventID);
  divAddr.addClass("gmap col-md-12");
  divAddr.html(eventItem.city + " , " + eventItem.state);
  divAddr.data("data-lng", eventItem.longitude);
  divAddr.data("data-lat", eventItem.latitude);
  divAddr.data("data-addr", eventItem.address);

  cardBody.append(h5);
  cardBody.append(h4);
  cardBody.append(p);
  cardBody.append(aCard);
  cardBody.append(divAddr);
     
  return cardDivContainer.append(cardBody);

}

function buildIconContainer(eventItem){
    
  var iconDivContainer = $("<div>");
  iconDivContainer.addClass("col-md-2");
  var iconDiv = $("<div>");
  iconDiv.addClass("icon");
  var iconA = $("<a>");
  iconA.attr("id", "a" + eventItem.id );
  iconA.data("data-parentid", eventItem.id);
  iconA.addClass("saveLink");
  iconA.addClass("coverr-nav-item");
  iconA.css("text-decoration", "none");
  iconA.attr("href", "#coverrs");
  iconA.attr("title","Save This!");
  var iconH1 = $("<h1>");
  var iconI = $("<i>");
  iconI.addClass("fas");
  iconI.addClass("fa-star");
  
  var iconB = $("<a>");
  iconB.attr("id", "b" + eventItem.id );
  iconB.attr("title","Not Interested");
  iconB.data("data-parentid", eventItem.id);
  iconB.addClass("removeLink");
  iconB.addClass("coverr-nav-item");
  iconB.css("text-decoration", "none");
  iconB.attr("href", "#coverrs");
  
  var iconBH1 = $("<h1>");
  var iconBI = $("<i>");
  iconBI.addClass("fas");
  iconBI.addClass("fa-times");
  iconH1.append(iconI);
  iconA.append(iconH1);
  iconDiv.append(iconA);
  iconBH1.append(iconBI);
  iconB.append(iconBH1);
  iconDiv.append(iconB);
  iconDivContainer.append(iconDiv);
  return iconDivContainer;
}

function createEvent(origObject){
  

  
  var eventObj = createObject(origObject);
  return eventObj;
}




function loadEvent(origObject){
  var eventObj = loadObject(origObject);
  return eventObj;
}


function createObjectURL(createObj){
  if (createObj.hasOwnProperty("image")){
    if (createObj[image][medium][url]==null){
    
      var imageURL="./assets/images/noimg.png";
      }
    else {imageURL=createObj.image.medium.url;};
    return imageURL;
  };
  }

function origObjectURL(origObject){
  if (origObject.imageURL==null){
    var imageURL="./assets/images/noimg.png";
    }
  else {var imageURL=origObject.imageURL;};
  return imageURL;
}
function origObjectDescription(origObject){
  if(origObject.description==null){      //error handling for NULL event description - just makes the 
    var eventDesc=origObject.title;   //description match the event title instead of displaying "null"
  }else {
    var eventDesc=origObject.description;
  }
  return eventDesc;
  
  
}

function createObjectDescription(origObject){
  if(origObject.description===null){      //error handling for NULL event description - just makes the 
    var eventDesc=origObject.title;   //description match the event title instead of displaying "null"
  }
  else var eventDesc=origObject.description;
  return eventDesc;
  
  
}


function createObjectPreview(origObject){
/*
  if (origObject.description.length>=151)
  {var desc_preview=origObject.description.substring(0,151)+"...";} //if the description is long, grab the first 150 characters of the description
  else {var desc_preview= origObject.description; }; //otherwise, just show the description

*/

  var description = origObject.description === null?'': origObject.description;
  if (description.length>=151)
  {var desc_preview=description.substring(0,151)+"...";} //if the description is long, grab the first 150 characters of the description
  else {var desc_preview= description; }; //otherwise, just show the description


  return desc_preview;
}

function origObjectPreview(origObject){
  var description = origObject.description === null?'': origObject.description;
  if (origObject.description.length>=151){
    var desc_preview=origObject.description.substring(0,151)+"...";
  } //if the description is long, grab the first 150 characters of the description
  else {
    var desc_preview= origObject.description ;
  }; //otherwise, just show the description

  return desc_preview;
}

function createObject(origObject){
  var dataObj = {
    id:origObject.id.split('@').join(''),
    title:origObject.title,
    address:origObject.venue_address,
    city:origObject.city_name,
    state:origObject.region_abbr,
    zip:origObject.postal_code,
    startTime:moment(origObject.start_time).format("h:mm a"),
    startDate:moment(origObject.start_time).format("ddd MMM DD"),
    daysUntil: moment().diff(moment(origObject.start_time), "days") === 0? "Happening TODAY!!": Math.abs(moment().diff(moment(origObject.start_time), "days")),
    venue:origObject.venue_name,
    venueURL:origObject.venue_url,
    imageURL:createObjectURL(origObject),
    description:createObjectDescription(origObject) === null? origObject.title:createObjectDescription(origObject) ,
    descriptionPreview:createObjectPreview(origObject) === null ? origObject.title : createObjectPreview(origObject),
    latitude : parseFloat(origObject.latitude),
    longitude : parseFloat(origObject.longitude)
  
  };

  return dataObj;

}

function loadObject(origObject){
  var dataObj = {
    id:origObject.id.split('@').join(''),
    title:origObject.title,
    address:origObject.address,
    city:origObject.city,
    state:origObject.state,
    zip:origObject.zip,
    startTime:moment(origObject.startTime).format("hh:mm:ss a"),
    startDate:moment(origObject.startTime).format("ddd MMM DD"),
    daysUntil: moment().diff(moment(origObject.start_time), "days") === 0? "Happening TODAY!!": Math.abs(moment().diff(moment(origObject.start_time), "days")),
    venue:origObject.venue,
    venueURL:origObject.venueURL,
    imageURL:origObjectURL(origObject),
    description:origObjectDescription(origObject) === null?origObject.title: origObjectDescription(origObject),
    descriptionPreview:origObjectPreview(origObject) === null? origObject.title: origObjectPreview(origObject),
    latitude : parseFloat(origObject.latitude),
    longitude : parseFloat(origObject.longitude)

  };

  return dataObj;

}
