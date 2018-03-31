// function tweetCardInfo() {
// 	        var twitterURL = "https://twitter.com/intent/tweet?text=" + CardInfo;
// 	        var CardInfo = $("#card").text();
// }
        
// function tweetCardInfo() {
//           var cardInfo = cardObject.title;
//           var tweetBtn = $('<a></a>').addClass('twitter-share-button').attr('href', 'http://twitter.com/share').attr('data-url', cardObject.imageLinks.thumbnail).attr('data-text', authors + cardObject.title);
//           $('.card-body').append(tweetBtn);
//           twttr.widgets.load();
// }
//  tweeCardInfo();
    function tweetCardInfo() {
          console.log("this one also");
          var cardInfo = eventItem.title;
          var twitterURL = "https://twitter.com/intent/tweet?text=" + CardInfo;
	        // var CardInfo = $("#card").text();          
          var tweetBtn = $('<a></a>').addClass('twitter-share-button').attr('href', 'http://twitter.com/share').attr('data-url', eventItem.imageURL).attr('data-text',eventItem.title);
          $('.card-body').append(tweetBtn);
          twttr.widgets.load();
        }
        tweetCardInfo();
