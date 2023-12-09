const {edxScrape} = require('./edx.js');
const {courseraScrape} = require('./coursera.js');
const {udemyScrape} = require('./udemy.js');
const {mitOcwScrape} = require('./mitocw.js');
const {linkedinLearningScrape} = require('./coursera.js');

async function main() {
    let start_page = 1; // Page to start at
    let num_pages = 5; // Number of pages to look at 
    // Keywords for linkedIn learning and OCW search scrapes
    const keywords = ['python', 'javascript', 'SQL', 'Java', 'Machine Learing', 'Data Science', 'UX Design','Certification']; 

    courseraScrape(start_page, num_pages);
    edxScrape(start_page, num_pages);
    udemyScrape(start_page, num_pages);
    mitOcwScrape(keywords);
    linkedinLearningScrape(keywords);
}

main()