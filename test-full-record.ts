import { startRecording } from './src/recorder.js';
import { resolve } from 'path';

async function test() {
  const options = {
    scriptPath: resolve(process.cwd(), 'src/demos/fspec-demo.ts'),
    outputPath: resolve(process.cwd(), 'recordings/full-test.webm'),
    width: 120,
    height: 30,
    fps: 30,
    headless: false
  };

  console.log('Starting recording with options:', options);

  try {
    await startRecording(options);
    console.log('Recording completed successfully!');
  } catch (error) {
    console.error('Recording failed:', error);
    throw error;
  }
}

test();
