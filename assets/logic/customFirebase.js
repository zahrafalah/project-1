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

  



var eventObj =   {
    eventID:"",
    location:"",
    title:"",
    imageURLsmall:""
 }; 


//Simulte user data
var userId = 1;
var userName = 'Mario';
pinCode = "1234";
addDate = moment().format("MMDDYYYY");
loginState = "loggedIn";



var userObj = {
    userId: userId,   
    userName: userName,
    pinCode: pinCode,
    addDate: addDate,  
    loginState : loginState,
    savedEvents:[] 
  };



  //First add the initial child user the user.
  database.ref("users/" + userObj.userName).set(userObj);


  // Logs everything to console
  console.log(userObj);

  // Can we search for Mario?
  var searchName = "Mario";
  //Create a reference to Mario
  var ref=database.ref("users/"+searchName);
  console.log(ref);


  //Test for saved events
  ref.once("value").then(function(snapshot){
    var eventExists = snapshot.child("savedEvents").exists(); 
    if(eventExists){
        console.log("Events are present");
    }else{
        //This is the initial event
        //create arrayofevents that werecreated
        var initialSnapShot = [{"id":"ThisEvent"}];
        database.ref("users/" + userObj.userName + "/savedEvents").set(initialSnapShot);
    }
    
  });
/*
  var refEvent = database.ref("users/Mario/savedEvents/" );
  console.log(refEvent);
  refEvent.once("value").then(function(snapshot){
       var data = snapshot.val();

       console.log(data);
  });
*/

var refEvent = eventDatabase.ref("/users/Mario/savedEvents/0");
refEvent.on("value", function(snapshot) {
    console.log(snapshot.val());
     
 }, function (error) {
    console.log("Error: " + error.code);
 });
  