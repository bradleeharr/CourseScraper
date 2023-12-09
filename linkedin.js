const puppeteer = require('puppeteer');
const { genericScrape, delay, saveDataToFile } = require('./utilities.js');

async function extractLinkedInLearningData(browser, keywords) {
    const page = await browser.newPage();
    const uniqueCourses = new Set();
    
    for (const keyword of keywords) {
        const url = `https://www.linkedin.com/learning/search?keywords=${encodeURIComponent(keyword)}`;
        await page.goto(url, { waitUntil: 'networkidle2' });

        const courses = await page.evaluate(() => {
            const extractedCourses = [];
            const courseElements = document.querySelectorAll('li.results-list__item');
            courseElements.forEach(el => {
                const title = el.querySelector('div.base-card')?.innerText.trim();
                const link = el.querySelector('a.base-card__full-link')?.getAttribute('href');
                if (link && !link.startsWith('http://') && !link.startsWith('https://')) {
                    link = new URL(link, 'https://www.linkedin.com/learning/').href;
                }
                extractedCourses.push({ title, link });
            });
            return extractedCourses;
        });

        courses.forEach(course => {
            const courseString = JSON.stringify(course); // Convert to string for Set comparison
            uniqueCourses.add(courseString);
        });

        await delay(1000); // Delay to prevent rate limiting
    }

    await page.close();
    return Array.from(uniqueCourses).map(courseString => JSON.parse(courseString)); // Convert back to object
}

async function linkedInLearningScrape(keywords) {
    const browser = await puppeteer.launch();
    const coursesData = await extractLinkedInLearningData(browser, keywords);
    await saveDataToFile(coursesData, 'linkedin_learning_courses.json');
    await browser.close();
}

async function main() {
    const keywords = ['python', 'javascript', 'SQL', 'Java', 'Machine Learing', 'Data Science', 'UX Design','Certification']; 
    await linkedInLearningScrape(keywords);
}

if (require.main === module) {
    main().catch(error => console.error('Error in linkedin course scrape:', error));
}

module.exports = { linkedInLearningScrape };
