const puppeteer = require('puppeteer');

const getScreenshot = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://covid.agidevelopment.com`, {
    waitUntil: 'networkidle0',
  });
  await page.screenshot({
    path: `screenshot.png`,
    fullPage: true,
  });
  await browser.close();
};

switch (process.argv[2]) {
  case 'getScreen':
    getScreenshot(process.argv[3]);
    break;
  default:
    console.log('Wrong argument!');
}
