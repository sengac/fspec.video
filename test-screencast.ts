import puppeteer from 'puppeteer';

async function testScreencast() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: false });

  console.log('Creating page...');
  const page = await browser.newPage();

  console.log('Navigating to google...');
  await page.goto('https://google.com');

  console.log('Starting screencast...');
  const recorder = await page.screencast({
    path: 'recordings/test-screencast.webm',
    ffmpegPath: '/opt/homebrew/bin/ffmpeg'
  });

  console.log('Waiting 3 seconds...');
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('Stopping screencast...');
  await recorder.stop();

  console.log('Closing browser...');
  await browser.close();

  console.log('Done!');
}

testScreencast().catch(console.error);
