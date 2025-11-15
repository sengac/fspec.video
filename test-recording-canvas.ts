import puppeteer from 'puppeteer';

async function testRecordingCanvas() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });

  const page = await browser.newPage();

  // Set simple HTML with colored boxes to see what's actually being captured
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; }
        body {
          width: 1920px;
          height: 1080px;
          background: black;
          position: relative;
        }
        #box1 {
          position: absolute;
          top: 0;
          left: 0;
          width: 1920px;
          height: 1080px;
          background: red;
          border: 10px solid yellow;
          box-sizing: border-box;
        }
        #box1::after {
          content: 'FULL 1920x1080';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 100px;
          font-family: monospace;
        }
      </style>
    </head>
    <body>
      <div id="box1"></div>
    </body>
    </html>
  `);

  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('Starting screencast...');
  const recorder = await page.screencast({
    path: 'recordings/canvas-test.webm',
    ffmpegPath: '/opt/homebrew/bin/ffmpeg'
  });

  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('Stopping screencast...');
  await recorder.stop();

  await browser.close();

  console.log('Test complete - check recordings/canvas-test.webm');
}

testRecordingCanvas().catch(console.error);
