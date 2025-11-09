import puppeteer, { Browser, Page } from 'puppeteer';
import { spawn } from 'child_process';
import { writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';
import { startServer } from './server.js';

export interface RecordingOptions {
  scriptPath: string;
  outputPath: string;
  width: number;
  height: number;
  fps: number;
  headless: boolean;
}

export async function startRecording(options: RecordingOptions): Promise<void> {
  let browser: Browser | null = null;
  let serverCleanup: (() => Promise<void>) | null = null;

  try {
    // Ensure output directory exists
    await mkdir(dirname(options.outputPath), { recursive: true });

    // Start the Express server
    console.log('Starting web server...');
    const { url, cleanup } = await startServer();
    serverCleanup = cleanup;

    // Launch Puppeteer browser
    console.log('Launching browser...');
    browser = await puppeteer.launch({
      headless: options.headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--allow-file-access-from-files',
      ],
      defaultViewport: {
        // 4K resolution for high quality recording
        width: 3840,
        height: 2160,
      },
    });

    const page = await browser.newPage();

    // Listen to browser console for debugging
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error') {
        console.error(`🌐 Browser console.error: ${text}`);
      } else {
        console.log(`🌐 Browser console.${type}: ${text}`);
      }
    });

    // Navigate to the terminal page
    console.log('Loading terminal interface...');
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Wait for terminal to be ready
    await page.waitForSelector('#terminal', { timeout: 10000 });

    // Wait for canvas element to be created by xterm.js
    await page.waitForSelector('canvas', { timeout: 10000 });

    // Wait a bit more to ensure xterm has done its initial render
    await new Promise(resolve => setTimeout(resolve, 500));

    // Start recording using Puppeteer's built-in screencast
    console.log('Starting video capture...');
    const recorder = await page.screencast({ path: options.outputPath, ffmpegPath: '/opt/homebrew/bin/ffmpeg' });

    // Run the demo script
    console.log('Executing demo script...');
    await runDemoScript(page, options.scriptPath);

    // Wait a bit to ensure last frames are captured
    await new Promise(resolve => setTimeout(resolve, 500));

    // Stop recording
    console.log('Stopping video capture...');
    await recorder.stop();
  } finally {
    if (browser) {
      await browser.close();
    }
    if (serverCleanup) {
      await serverCleanup();
    }
  }
}

async function runDemoScript(page: Page, scriptPath: string): Promise<void> {
  // Spawn the demo script as a separate process
  // Capture stdout and send to browser terminal via window.writeToTerminal()
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['tsx', scriptPath], {
      env: {
        ...process.env,
        FSPEC_DEMO_MODE: 'true',
      },
    });

    // Capture stdout and send each chunk to browser terminal
    child.stdout.on('data', async (data: Buffer) => {
      const text = data.toString();
      console.log('📝 Captured stdout:', JSON.stringify(text));

      try {
        await page.evaluate((t: string) => {
          console.log('🌐 Browser received:', JSON.stringify(t));
          // @ts-expect-error - window.writeToTerminal is exposed by server.ts
          if (typeof window.writeToTerminal === 'function') {
            // @ts-expect-error - window.writeToTerminal is exposed by server.ts
            window.writeToTerminal(t);
            console.log('✅ Written to terminal');
          } else {
            console.error('❌ window.writeToTerminal is not a function:', typeof window.writeToTerminal);
          }
        }, text);
      } catch (error) {
        console.error('❌ Error sending to browser:', error);
      }
    });

    // Also capture stderr for debugging
    child.stderr.on('data', async (data: Buffer) => {
      const text = data.toString();
      console.error('Demo script stderr:', text);
    });

    child.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Demo script exited with code ${code}`));
      }
    });

    child.on('error', reject);
  });
}
