import { GOOGLE_BOOKS_API_KEY, OMDB_API_KEY } from "./utils.js";

// Function for the search button. User inputs a search term into the input box that is then transferred to a variable.
$("#searchBtn").on("click", function (event) {
  event.preventDefault();
  const searchTerm = $("#media-search").val();

  const googleUrl = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${GOOGLE_BOOKS_API_KEY}`;
  var bookDiv = $("#book-results");

  const searchURL = `https://www.omdbapi.com/?s=${searchTerm}&apiKey=${OMDB_API_KEY}`;
  console.log(searchURL);
  var movieDiv = $("#movie-results");

  // Empties the divs, so that when the user inputs a new search, they can immediately identify their most recent search results.
  bookDiv.empty();
  movieDiv.empty();

  // Send an AJAX call for the assembled URL to get the book information.
  $.ajax({
    url: googleUrl,
    method: "GET",
  }).then(function (bookGet) {
    for (let i = 0; i < bookGet.items.length; i++) {
      if (bookGet.items[i].searchInfo) {
        var synop = "Synopsis: " + bookGet.items[i].searchInfo.textSnippet;
      } else {
        var synop = "No synopsis available.";
      }
      if (bookGet.items[i].volumeInfo.authors) {
        var authors = "Author(s): " + bookGet.items[i].volumeInfo.authors[0];
      } else {
        var authors = "Author(s): No author information available.";
      }
      if (bookGet.items[i].volumeInfo.title) {
        var title = bookGet.items[i].volumeInfo.title;
      }
      if (bookGet.items[i].volumeInfo.subtitle) {
        var subtitle = bookGet.items[i].volumeInfo.subtitle;
      }
      if (bookGet.items[i].volumeInfo.pageCount) {
        var pageCount = "Page Count: " + bookGet.items[i].volumeInfo.pageCount;
      }
      if (bookGet.items[i].volumeInfo.publishedDate) {
        var publishedDate =
          "Published: " + bookGet.items[i].volumeInfo.publishedDate;
      }
      if (bookGet.items[i].volumeInfo.averageRating) {
        var averageRating =
          "Average Rating: " + bookGet.items[i].volumeInfo.averageRating + "/5";
      }
      if (bookGet.items[i].volumeInfo.imageLinks) {
        var coverLg = bookGet.items[i].volumeInfo.imageLinks.thumbnail;
        var coverImg = $("<img>");
        coverImg.attr("src", coverLg);
      } else {
        var coverLg = "";
      }

      if (bookGet.items[i].saleInfo.buyLink) {
        var buyLink = bookGet.items[i].saleInfo.buyLink;
        var linkBtn = $("<button>");
        linkBtn.text("Purchase on Google Books");
        linkBtn.attr("onclick", `window.open('${buyLink}', '_blank');`);
        linkBtn.attr("class", "btn-books");
      } else {
        var buyLink = "";
        var linkBtn = $("<div>");
      }

      // Variables to make new HTML elements for the card details (book title, author, subtitle, and synopsis) and button is created to purchase book title.
      var resultsCard = $("<div>");
      resultsCard.attr("class", "card");
      var wrapper = $("<div>");
      wrapper.attr("class", "wrapper");
      var cardTitle = $("<h5>");
      var cardSubtitle = $("<p>");
      var cardAuthor = $("<p>");
      var cardSynop = $("<p>");
      var cardPageCount = $("<p>");
      var cardPublishedDate = $("<p>");
      var cardAverageRating = $("<p>");

      cardTitle.text(title);
      cardTitle.attr("class", "card-title");
      cardSubtitle.text(subtitle);
      cardAuthor.text(authors);
      cardSynop.html(synop);
      cardPageCount.html(pageCount);
      cardPublishedDate.html(publishedDate);
      cardAverageRating.html(averageRating);

      // Populates HTML with a card with the book title, author, synopsis, button to purchase the book, and the cover image of the book.
      wrapper.append(cardTitle);
      wrapper.append(coverImg);
      wrapper.append(linkBtn);
      resultsCard.append(wrapper);
      resultsCard.append(cardSubtitle);
      resultsCard.append(cardAuthor);
      resultsCard.append(cardSynop);
      resultsCard.append(cardPageCount);
      resultsCard.append(cardPublishedDate);
      resultsCard.append(cardAverageRating);
      bookDiv.append(resultsCard);
    }
  });

  // Send an AJAX call for the assembled URL to get the movie title.
  $.ajax({
    url: searchURL,
    method: "GET",
  }).then(function (movieGet) {
    for (let i = 0; i < movieGet.Search.length; i++) {
      const searchIMDBid = movieGet.Search[i].imdbID;

      // URL Base for API.
      const idURL = `https://www.omdbapi.com/?i=${searchIMDBid}&apiKey=${OMDB_API_KEY}`;

      // Send an AJAX call for the assembled URL to get information about the movie details.
      $.ajax({
        url: idURL,
        method: "GET",
      }).then(function (idGet) {
        if (idGet.Title) {
          var movieTitle = idGet.Title;
        } else {
          var movieTitle = "";
        }
        if (idGet.Director !== "N/A") {
          var director = "Director: " + idGet.Director;
        } else {
          var director = "No director information available.";
        }
        if (idGet.Plot) {
          var movieSynop = "Synopsis: " + idGet.Plot;
        } else {
          var movieSynop = "No synopsis available.";
        }
        if (idGet.Poster && idGet.Poster !== "N/A") {
          var moviePoster = idGet.Poster;
        } else {
          var moviePoster = "";
        }
        if (idGet.Ratings[0]) {
          var imdbRating = "IMDB Rating: " + idGet.Ratings[0].Value;
        } else {
          var imdbRating = "";
        }
        if (idGet.Rated !== "N/A") {
          var rated = "MPA Rating: " + idGet.Rated;
        } else {
          var rated = "MPA rating is not available.";
        }
        if (idGet.Runtime) {
          var runtime = "Runtime: " + idGet.Runtime;
        } else {
          var runtime = "";
        }
        if (idGet.Released) {
          var released = "Released: " + idGet.Released;
        } else {
          var released = "";
        }

        // Variables to make new HTML elements for the card details (movie title, director, rating, and synopsis) and button is created to watch trailers.
        var movieResultsCard = $("<div>");
        movieResultsCard.attr("class", "card");
        var wrapper = $("<div>");
        wrapper.attr("class", "wrapper");
        var movieCoverImg = $("<img>");
        var movieCardTitle = $("<h5>");
        var movieCardDirector = $("<p>");
        var movieCardSynop = $("<p>");
        var movieCardRating = $("<p>");
        var movieCardRated = $("<p>");
        var movieCardRuntime = $("<p>");
        var movieCardReleased = $("<p>");
        var trailerBtn = $("<button>");
        movieCoverImg.attr("src", moviePoster);
        movieCardTitle.html(movieTitle);
        movieCardTitle.attr("class", "card-title");
        movieCardDirector.html(director);
        movieCardSynop.html(movieSynop);
        movieCardRating.html(imdbRating);
        movieCardRated.html(rated);
        movieCardRuntime.html(runtime);
        movieCardReleased.html(released);

        // Button displayed. The title of the movie that is pulled is put into a variable where it is split and then separated by dashes.
        trailerBtn.text("More Info on IMDb");
        trailerBtn.attr("class", "btn-movies");
        var titleForLink = idGet.Title.split(" ").join("-");

        // On "click" function so that clicking the button will lead the user to IMDB where the title of their film is automatically inputted.
        trailerBtn.attr(
          "onclick",
          `window.open('https://www.imdb.com/find?q=${titleForLink}', '_blank');`
        );

        // Populates HTML with a card with the movie title, director, synopsis, button to access the trailer, and the poster image of the movie.
        wrapper.append(movieCardTitle);
        wrapper.append(movieCoverImg);
        wrapper.append(trailerBtn);
        movieResultsCard.append(wrapper);
        movieResultsCard.append(movieCardDirector);
        movieResultsCard.append(movieCardSynop);
        movieResultsCard.append(movieCardRating);
        movieResultsCard.append(movieCardRated);
        movieResultsCard.append(movieCardRuntime);
        movieResultsCard.append(movieCardReleased);
        movieDiv.append(movieResultsCard);
      });
    }
  });
});

// Function for the reset button. Clears the search input, book results, and movie results.
$("#resetBtn").on("click", function () {
  $("#media-search").val("");
  $("#book-results").empty();
  $("#movie-results").empty();
});

// A keypress event function that is attached to the form (where the search term is inputted by the user).
$("form").keypress(function (e) {
  if (e.which == 13) {
    return false;
  }
});
