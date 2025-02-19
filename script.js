/*
1.Initial Setup: Variable Declarations:
    projectName: String variable storing the project name (random-quote-machine).
    quotesData: Global variable declared but not yet assigned a value. It will hold the fetched quotes data.
    colors: Array containing a list of color codes for background and text changes.
    currentQuote, currentAuthor: Variables to store the currently displayed quote and author.
*/

const projectName = "random-quote-machine";
let quotesData;
const colors = [
  "#26a085",
  "#079e60",
  "#4c3e50",
  "#e39c12",
  "#d74c3c",
  "#8b59b6",
  "#EC6964",
  "#f522f4",
  "#582E32",
  "#CBDB89",
  "#89A2B8",
  "#ff2233",
  "#11cc11",
  "#1122ff",
  "#64B968",
];
let currentQuote = "";
let currentAuthor = "";

/* 
2. The getQuotes() function uses jQuery's AJAX functionality to fetch quotes data from a specified URL. 
    It handles the JSON response and stores the data in a global variable for later use. 
    The function returns a promise object, which is used to chain asynchronous operations.
*/

function getQuotes() {
  return $.ajax({
    headers: { Accept: "application/json" },
    url: "https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json",
    success: function (jsonQuotes) {
      quotesData =
        typeof jsonQuotes === "string" ? JSON.parse(jsonQuotes) : jsonQuotes;
      console.log("quotesData:", quotesData);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error fetching quotes:", textStatus, errorThrown);
      // Provide a fallback or user-friendly message
      $("#text").text("Failed to load quotes.");
      $("#author").text("");
    },
  });
}

/*
3. The getRandomQuote function effectively selects a random quote from the quotesData array by generating a random index and 
    using it to access the corresponding quote object.
*/

function getRandomQuote() {
  if (!quotesData || !quotesData.quotes || quotesData.quotes.length === 0) {
    console.error("No quotes data available.");
    return { quote: "No quotes available.", author: "" }; // Provide a default quote
  }
  return quotesData.quotes[
    Math.floor(Math.random() * quotesData.quotes.length)
  ];
}

/*
4. This getQuote() function is responsible for displaying a random quote with animations(fade-out and fade-in) and 
    updating social media sharing links. It's triggered when: 
    The document is ready (initial load) and The "New Quote" button is clicked. 
    The background and button colors are also randomly changed for visual appeal.
*/

function getQuote() {
  const randomQuote = getRandomQuote();
  currentQuote = randomQuote.quote;
  currentAuthor = randomQuote.author;

  $("#tweet-quote").attr(
    "href",
    "https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=" +
      encodeURIComponent('"' + currentQuote + '" ' + currentAuthor)
  );

  $("#tumblr-quote").attr(
    "href",
    "https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes,freecodecamp&caption=" +
      encodeURIComponent(currentAuthor) +
      "&content=" +
      encodeURIComponent(currentQuote) +
      "&canonicalUrl=https%3A%2F%2Fwww.tumblr.com%2Fbuttons&shareSource=tumblr_share_button"
  );

  $(".quote-box__quote-text").animate({ opacity: 0 }, 500, function () {
    $(this).animate({ opacity: 1 }, 500);
    $("#text").text(randomQuote.quote);
  });

  $(".quote-box__quote-author").animate({ opacity: 0 }, 500, function () {
    $(this).animate({ opacity: 1 }, 500);
    $("#author").html(randomQuote.author);
  });

  const color = colors[Math.floor(Math.random() * colors.length)];
  $("body").animate({ backgroundColor: color, color: color }, 1000); // Animate body
  $(".quote-box__buttons__button").animate({ backgroundColor: color }, 1000);
}

/* 
5. Following $(document).ready() jQuery function ensures that the functions getQuotes() and getQuote() are executed 
only after the entire HTML document has been loaded. 
This prevents JavaScript errors that might occur if elements or data are not yet available when the functions are called. 
The .then() method is used to handle the promise returned by getQuotes(). 
It takes a callback function that will be executed once the getQuotes() function has resolved successfully.
*/

$(document).ready(function () {
  getQuotes()
    .then(getQuote)
    .catch((error) => {
      console.error("Initial quote fetch failed:", error);
      $("#text").text("Failed to load quotes.");
      $("#author").text("");
    });

  $("#new-quote").on("click", getQuote);
});
