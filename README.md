# Educational Course Scraper

This collection of scripts was made to scrape educational course data from prominent online learning platforms such as Coursera, edX, MIT OpenCourseWare (OCW), and LinkedIn Learning. The eventual goal of this scraped data was to be used to generate data embeddings for a GPT chat bot, giving it the ability to recommend online courses to a user.

index.js is the main function of the entire script, but each individual script should also be able to be run with example main() provided.

The courses will be saved in JSON format in `[sitename]_courses.json`
## Scripts Overview

### `index.js`

- The main entry point to run the scripts for Coursera, edX, Udemy, OCW, and LinkedIn Learning.
- Note OCW, edX and Udemy are left out for simplicity. The OCW implementation is very similar to the LinkedIn Learning search, while edX and Udemy are similar to Coursera extraction.

### `utility.js`

- Provides common utility functions used across all scraping scripts.
- **Includes**: Delay function for rate limiting, robots.txt compliance check, file saving function, and a generic scraping function (`genericScrape`) which does a standard scraping process across coursera, edx, and udemy.
### `coursera.js`
- Extracts course data from Coursera.

### `linkedin.js`
- Extracts course data from LinkedIn Learning based on specified keywords search.

## How to Run

1. Install dependencies: Node.js, Axios, and Puppeteer
2. Run `node index.js` to execute the scraping process.
3. The scripts should run and save course data into JSON files.
