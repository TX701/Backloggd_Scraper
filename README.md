# Manual For Backloggd_Scraper

## Introduction
A tool that generates a text file of a [Backloggd](https://backloggd.com/) user's played games. 

Each line of this text file with have:
- the game's name
- the cover image's URL
- the game's release date
- the user's rating for the game out of ten
  
These items will be comma seperated, if a piece of data is null it will appear as an empty string, unless it is a rating which will appear as "N/A".

This is a program written in Javascript and **it is meant to be run in a code compiler's terminal**.
Visual Studio Code is what this program was created and tested with.

**This program was made 1/21/2025. If Backloggd changes the way that it's webpages are written, then this program may no longer work.**

## Set up
1. First install [NodeJS](https://nodejs.org/en) and make sure your code editor recognizes NodeJS commands

   You can check this by running
   
   ```
   node --version
   ```
     in your editor's terminal

3. Download the code from this repository and open it in your editor

     You should have: script.js (and README.md, but you can delete it if you would like)

4. Install [axios](https://axios-http.com/docs/intro) and [cheerio](https://cheerio.js.org/)
     This can be done by running commands in your editor's terminal: 

     Axios install:
   ```
   npm install axios
   ```
   Cheerio install:
   ```
   npm install cheerio
   ```

At this point you should be set for running the program.

## Running
1. In your editor's terminal type the following command

   ```
   node script.js
   ```

2. In the terminal you should see this message
   
   ```
   Please enter a username:
   ```

   Follow along with what the program states and enter in a username

   2.5. If the username you entered does not exist on Backloggd, you will be told so and prompted to enter in a username once more

3. The program will then go through the process of fetching all the data, the terminal will update you on how many games are currently being processed

4. Once you see

   ```
   The data has been written to: output\[user].txt
   ```

   That means that the program has finished running. The final text file will be in the output folder (this folder was created on the program's first run), the file will be named after the username.

## Edits and Notices
### Rating
Although Backloggd works on a five star system, the data in the page is stored as its value*2. To avoid dealing with half stars, the data for this program is just stored as its out of ten rating.

### Limit
To avoid any possibility of an inifinite loop, a safety measure has been added to prevent the while loop from iterating too many times. This safety assumes that a user has under 1250 games played on Backloggd. For a user with a higher number games played, please change the '25' on line 15 to be a higher number.
  ```javascript
    // if the user has more then 1250 games on backlogged than increase 25 to another number
    while (safety < 25) {
  ```
<p align="right"><sub>script.js lines 14 - 15</sub></p>
(This value (25 or whatever you change it to) is related to the number of pages. Each page has 50 games, 25*50 = 1250)

### Data
If you would like to remove one of the values (name, img URL, date, rating) that is fetched, or if you would like to change the format of the data saved, edit the following sections:

  #### Values
  ```javascript
      $(".col-cus-5.col-md-cus-8.col-lg-cus-10.mt-2.px-1.rating-hover").each((index, element) => {
        const game = $(element).find(".card-img").attr("alt")?.trim() || ""; // gets the games name
        const img = $(element).find(".card-img").attr("src")?.trim() || ""; // gets a link to the cover
        const date = $(element).find(".release-below").text().trim() ||  ""; // gets games release data
        let rating = $(element).find(".card").attr("data-rating")?.trim() || ""; // user rating
        rating = (rating != "") ? `${rating}/10` : "N/A"; // if rating is not empty add /10 to the end- otherwise set rating to N/A

        games.push({game, img, date, rating}); // push values to the array of games
      });
  ```
<p align="right"><sub>script.js lines 19 - 27</sub></p>

#### Format
```javascript
    games.forEach(element => {
      userData += `${element.game}, ${element.img}, ${element.date}, ${element.rating}\n` // change this line if you want a different syntax for your text file
    });
    
    return userData.replace(/\n.*$/, ""); // returns userData with the \n at the very end of the string removed
  ```
<p align="right"><sub>script.js lines 41 - 45</sub></p>
