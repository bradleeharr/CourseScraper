const {genericScrape} = require('./utilities.js')

async function extractCourseraData(page) {
  // Gather data from coursera page
    const courseData = await page.evaluate(() => {
    const courses = [];
    const courseElements = document.querySelectorAll('div.cds-ProductCard-content');
    courseElements.forEach(el => {
      const title = el.querySelector('h3')?.innerText.trim();
      const partner = el.querySelector('div.cds-ProductCard-partnerInfo')?.innerText.trim();
      const rating = el.querySelector('div.cds-CommonCard-ratings')?.innerText.trim();
      const metadata = el.querySelector('div.cds-CommonCard-metadata')?.innerText.trim();
      let link = el.querySelector('a')?.getAttribute('href');
      if (!link.startsWith('http://') && !link.startsWith('https://')) {
        link = new URL(link, 'https://coursera.org/').href;
      }
      let skills = el.querySelector('div.cds-ProductCard-body')?.innerText.trim();
      // Remove prepending text for the skills section
      if (skills && skills.includes('Skills you\'ll gain:')) {
        skills = skills.split('Skills you\'ll gain:')[1].trim();
      }
      courses.push({ title, skills, partner, rating, metadata, link});
    });
    return courses;
  });
  return courseData;
}

async function courseraScrape(startPage, numPages) {
  await genericScrape('https://www.coursera.org/courses?', startPage, numPages, 'coursera_courses.json', extractCourseraData);
}

async function main() {
  // Example use case
  let startPage = 10
  let numPages = 3
  await courseraScrape(startPage, numPages);
}

if (require.main === module) {
  main().catch(error => console.error('Error in main:', error));
}

module.exports = { courseraScrape }
