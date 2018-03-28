function tweetCardInfo() {
	        var twitterURL = "https://twitter.com/intent/tweet?text=" + CardInfo;
	        var CardInfo = $("#card").text();
}
        
function tweetCardInfo() {
          var cardInfo = cardObject.title;
          var tweetBtn = $('<a></a>').addClass('twitter-share-button').attr('href', 'http://twitter.com/share').attr('data-url', cardObject.imageLinks.thumbnail).attr('data-text', authors + cardObject.title);
          $('.card-body').append(tweetBtn);
          twttr.widgets.load();
}
 tweeCardInfo();
