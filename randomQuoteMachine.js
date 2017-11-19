/*Written by Fremy Santana
  Last Modified on May 12, 2017*/

$(document).ready(function() {
  var quote; var person; var tweet;
  $(".quote").append('Click the "Next Quote" button.');
  $(".author").append("- " + 'Fremy Santana');
  
  function uniToChar(str) {
    /*Some quotes from the API have unicode and/or HTML tags. 
    This functions combs through the quote to replace the unicode 
    with its corresponding symbol and remove the tags.*/
    var newStr = str;
    while (newStr.indexOf("&#") > -1) {
      var startOfUni = newStr.indexOf("&#") + 2; var char;
      var endOfUni = newStr.indexOf(";", startOfUni);
      var unicode = newStr.substr(startOfUni, endOfUni - startOfUni);
      var reUnicode = new RegExp("&#" + unicode + ";", "g");
      char = String.fromCharCode(unicode);
      newStr = newStr.replace(reUnicode, char);
    };
    while (newStr.indexOf("<") > -1) {
      var htmlStart = newStr.indexOf("<");
      var htmlEnd = newStr.indexOf(">", htmlStart) +  1;
      var htmlTag = newStr.substr(htmlStart, htmlEnd - htmlStart);
      var reHTML = new RegExp(htmlTag, 'g');
      newStr = newStr.replace(reHTML, '');
      }
    return newStr;
  };
  
  function nextQuote() {
    /*Connects to the QuotesOnDesign API to get a random quote.*/
    $.ajax({
      url: 'http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1',
      success: function(data) {
        var post = data.shift(); // The data is an array of posts. Grab the first one.
        quote = uniToChar(post.content.slice(3, -7)); person = uniToChar(post.title);
        var quoteLettersReversed = quote.split('').reverse(); var sentenceEnd = ['.','?','!']
        tweet = '"' + quote + '"' + ' - ' + person;

        // Make sure quote is short enough to be tweetable and is a complete sentence.
        if (tweet.length > 140) {nextQuote();}
        else if (sentenceEnd.indexOf(quoteLettersReversed[0]) == -1) {nextQuote();}
        else {
          $('.quote').html(quote);
          $('.author').html("- " + person);
        };
      },
      cache: false
    });
  };
 
  $(".next_quote").on('click', function(e) {
    e.preventDefault();
    nextQuote();
    //Changes the CSS 'color' variable to a new random color for each new quote.
    var r = Math.floor(Math.random()*256);  
    var g = Math.floor(Math.random()*256); 
    var b = Math.floor(Math.random()*256);
    var colorValue = "rgb(" + r + "," + g + "," + b +")";
    $("body").get(0).style.setProperty("--color", colorValue);
  });

  function encodeURL(str) {
    /*Replaces the semicolon or ampersand symbols with URL encodings 
    so that the quote may still be tweeted.*/
    var encodedTweet = str
    while (encodedTweet.search(/[;&]/) > -1) {
      var charLoc = encodedTweet.search(/[;&:/=@?]/)
      var char = encodedTweet.substring(charLoc, charLoc + 1)
      var encoding = encodeURIComponent(char)
      var encodedTweet = encodedTweet.replace(char, encoding)
    }
  return encodedTweet;
  };
  
  $(".tweet").on("click", function() {
     $(".tweet").attr("href", 'https://twitter.com/intent/tweet?text="' + encodeURL(quote) + '"' + ' - ' + person);
  });
});
