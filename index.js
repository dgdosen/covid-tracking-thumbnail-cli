const puppeteer = require('puppeteer');

const getScreenshot = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://covid.agidevelopment.com`, {
    waitUntil: 'networkidle0',
  });
  // await page.screenshot({
  //   path: `screenshot.png`,
  //   fullPage: true,
  // });

  async function screenshotDOMElement(opts = {}) {
    const padding = 'padding' in opts ? opts.padding : 0;
    const path = 'path' in opts ? opts.path : null;
    const selector = opts.selector;
    if (!selector) throw Error('Please provide a selector.');
    const rect = await page.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const { x, y, width, height } = element.getBoundingClientRect();
      return { left: x, top: y, width, height, id: element.id };
    }, selector);
    if (!rect)
      throw Error(`Could not find element that matches selector: ${selector}.`);
    return await page.screenshot({
      path,
      clip: {
        x: rect.left - padding,
        y: rect.top - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      },
    });
  }

  await screenshotDOMElement({
    path: 'screenshot.png',
    selector: '#covid-daily-linechart',
    padding: 16,
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
