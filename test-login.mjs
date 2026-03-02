import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Listen for console events
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('requestfailed', request => {
    console.log(`FAILED REQUEST: ${request.url()} - ${request.failure()?.errorText}`);
  });
  page.on('response', response => {
    if (!response.ok()) {
      console.log(`HTTP ERROR: ${response.url()} status ${response.status()}`);
    }
  });


  console.log('Navigating to http://localhost:3000');
  await page.goto('http://localhost:3000');

  console.log('Typing username and password');
  await page.type('#username', 'admin');
  await page.type('#password', 'password123');

  console.log('Clicking login button');
  // Attempting to click the submit button
  await page.click('button[type="submit"]');

  console.log('Waiting for network idle or navigation...');
  // Wait a bit to see what happens
  await new Promise(r => setTimeout(r, 2000));

  const url = page.url();
  console.log('Final URL:', url);

  await browser.close();
})();
