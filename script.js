const axios = require("axios"); //npm install axios
const cheerio = require("cheerio"); //npm install cheerio

// scraping backloggd data ----------------------------------------------------------------------------------------------------------------

async function scapeSite(user) {
  const url = `https://www.backloggd.com/u/${user}/games/release/`;
  let currentPage = 1;
  const games = [];

  try {
    let safety = 0; // this will prevent the loop from running forever if something goes wrong

    // if the user has more than 1250 games on backlogged then increase 25 to another number
    while (safety < 25) {
      const { data } = await axios.get(`${url}${user}?page=${currentPage}`);
      const $ = cheerio.load(data);

      $(".col-cus-5.col-md-cus-8.col-lg-cus-10.mt-2.px-1.rating-hover").each((index, element) => {
        const game = $(element).find(".card-img").attr("alt")?.trim() || ""; // gets the games name
        const img = $(element).find(".card-img").attr("src")?.trim() || ""; // gets a link to the cover
        const date = $(element).find(".release-below").text().trim() ||  ""; // gets games release data
        let rating = $(element).find(".card").attr("data-rating")?.trim() || ""; // user rating
        rating = (rating != "") ? `${rating}/10` : "N/A"; // if rating is not empty add /10 to the end- otherwise set rating to "N/A"

        games.push({game, img, date, rating}); // push values to the array of games
      });

      console.log(`${games.length} games fetched`); // current progress

      let nextPageDisabled = $("span.page.next.disabled").length > 0;
      if (nextPageDisabled) {
        break; // there are no more games to go through- stop running
      } else {
        currentPage++; // go to the next page
      }
    }
    
    let userData = "";

    games.forEach(element => {
      userData += `${element.game}, ${element.img}, ${element.date}, ${element.rating}\n` // change this line if you want a different syntax for your text file
    });
    
    return userData.replace(/\n.*$/, ""); // returns userData with the \n at the very end of the string removed

  } catch (error) {
    console.error("Error scraping:", error);
  }
}

// functions for getting input from the user ----------------------------------------------------------------------------------------------------------------

const readline = require('readline');

const read = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const getUserName = (text) => {
  return new Promise((resolve) => {
    read.question(text, (user) => {
      resolve(user);
    });
  });
};

// getting data from scrape function and writing to file ----------------------------------------------------------------------------------------------------------------

const fetchData = async (user) => {
  const write = require("fs");

    // if there is no output folder, create one
    if (!write.existsSync("output/")) {
      write.mkdir("output", (error) => {
        if (error) {
          console.error(error);
        } else {
          console.log("\"output\" folder created");
        }
      });
    } 

  try {
    const data = await scapeSite(user);

    write.writeFile(`output/${user}.txt`, data, (error) => {
      if (error) {
        console.error("Error writing to file:", error);
      } else {
        console.log(`The data has been written to: output\\${user}.txt`);
      }
    });

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// main function ----------------------------------------------------------------------------------------------------------------

const main = async () => {
  let user = "";

  while (user == "") {
    user = await getUserName("Please enter a username: ");

    try {
      const response = await fetch(`https://www.backloggd.com/u/${user}/games/release/`, { method: "HEAD" });

      if (response.ok) {
        console.log("Username found, please wait while the elements are fetched");
      } else {
        console.log("That username does not exist on Backloggd");
        user = ""; // continues the loop and asks the user to enter a username once more
      }
    } catch (error) {
      console.error("Error searching for username:", error);
    }
  }

  read.close(); // no longer need input from user
  fetchData(user);
}

main();
