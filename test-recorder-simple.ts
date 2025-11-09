import puppeteer from 'puppeteer';
import { startServer } from './src/server.js';

async function test() {
  console.log('Starting server...');
  const { url, cleanup } = await startServer();
  console.log(`Server started at ${url}`);

  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  page.on('console', msg => {
    console.log(`BROWSER: ${msg.type()}: ${msg.text()}`);
  });

  console.log('Navigating to terminal...');
  await page.goto(url, { waitUntil: 'networkidle0' });

  console.log('Waiting for terminal...');
  await page.waitForSelector('#terminal');
  await page.waitForSelector('canvas');
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('Testing writeToTerminal...');
  const result = await page.evaluate(() => {
    console.log('In browser context');
    // @ts-expect-error
    console.log('window.writeToTerminal type:', typeof window.writeToTerminal);
    // @ts-expect-error
    if (typeof window.writeToTerminal === 'function') {
      // @ts-expect-error
      window.writeToTerminal('Hello from test!\\r\\n');
      return 'SUCCESS';
    }
    return 'FAILED';
  });

  console.log(`Result: ${result}`);

  await new Promise(resolve => setTimeout(resolve, 3000));

  await browser.close();
  await cleanup();
}

test().catch(console.error);
