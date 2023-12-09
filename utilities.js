
const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs').promises; 

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
async function checkRobotsTxt(url) {
    // Check Robots.txt file to make sure access is allowed
    const robotsUrl = `${new URL(url).origin}/robots.txt`;
    try {
        const robotsResponse = await axios.get(robotsUrl);
        return !robotsResponse.data.includes('Disallow: /courses');
    } catch (error) {
        console.error(`Error accessing the robots.txt file: ${error.message}`);
        return false;
    }
}
  
async function saveDataToFile(data, filename) {
    // Save Data to JSON File
    await fs.writeFile(filename, JSON.stringify(data, null, 2));
    console.log(`Data saved to ${filename}`);
  }
  
async function genericScrape(url, startPage, maxPages, outputFilename, scrapeFunction) {
    if (!await checkRobotsTxt(url)) {
        console.log(`Access disallowed by robots.txt for ${url}`);
        return;
    }
  
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36');
  
    let currentPage = startPage;
    let coursesData = [];
    try {
        while (currentPage < maxPages + startPage) {
            console.log(`Accessing Page ${currentPage} of ${url}`);
            const pageUrl = `${url}&page=${currentPage}`;
            await page.goto(pageUrl, { waitUntil: 'networkidle2' });
  
            const newCoursesData = await scrapeFunction(page);
            if (newCoursesData.length === 0) {
                break; // Exit the loop if no data is found
            }
  
            coursesData.push(...newCoursesData);
            currentPage++;
  
            await delay(1000); // Delay to prevent rate limiting
        }
    }
    catch(error) { console.error('Error in course extraction:', error); }
    finally {
        await saveDataToFile(coursesData, outputFilename);
        console.log(`Closing Browser for ${url}...`);
        await browser.close(); 
    }
  }

  module.exports = { delay, checkRobotsTxt, saveDataToFile, genericScrape }
