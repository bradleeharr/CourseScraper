const {genericScrape} = require('./utilities.js')

async function extractEdxData(page) {
    // Gather data from edx page
    const courseData = await page.evaluate(() => {
    const courses = [];
    const courseElements = document.querySelectorAll('div.base-card-wrapper');
    courseElements.forEach(el => {
      const title = el.querySelector('div.pgn__card-header-title-md')?.innerText.trim();
      const partner = el.querySelector('div.pgn__card-header-subtitle-md')?.innerText.trim();
      let link = el.querySelector('a')?.getAttribute('href');
      if (!link.startsWith('http://') && !link.startsWith('https://')) {
        link = new URL(link, 'https://edx.org/').href;
      }
      courses.push({title, partner, link});
    });
    return courses;
  });
  return courseData;
}

async function edxScrape(startPage, numPages) {
  await genericScrape('https://www.edx.org/search?tab=course', startPage, numPages, 'edx_courses.json', extractEdxData);
}

async function main() {
  // Example use case
  let startPage = 10
  let numPages = 3
  await edxScrape(startPage, numPages);

}

if (require.main === module) {
  main().catch(error => console.error('Error in main:', error));
}

module.exports = { edxScrape };
