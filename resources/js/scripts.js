var clientID='Hv6x2ZbdqnFmcWVm';
var queryURL = "http://api.eventful.com/json/events/search?...&location=San+Diego";

//Search Parameters for Eventful
var subject = 'music';
var where = 'Los Angeles';
var sortOrder = 'popularity';
var beginDate = '2018010100';
var endDate = '2018031600';
var pageSize = 25;


$(document).ready(function(){
    alert("")
    $('#button1').on('click', show_alert());

   
});

 
async function show_alert()
{
  var oArgs = {
    //app_key:"Hv6x2ZbdqnFmcWVm",
    app_key:clientID,
    id: "20218701",
    page_size: pageSize ,
  };
  
  let promise = await EVDB.API.call("/events/get", oArgs, function(oData) {
  
  // Note: this relies on the custom toString() methods below
  console.log(oData);

  
   });

   let result = await promise;

    alert(result);
 }

function show_alert2()
{
    var oArgs = {
    app_key: clientID,
    q: "music",
    where: "Los Angeles", 
    "date": "2018010100-2018031600", 
    page_size: pageSize,
    sort_order: "popularity",
  }
  EVDB.API.call("/events/search", oArgs, function(oData) {
  // Note: this relies on the custom toString() methods below
  console.log(oData);
  });
}
