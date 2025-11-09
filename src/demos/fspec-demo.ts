/**
 * fspec TUI Demo Script
 * This demo runs fspec with a PTY and automatically quits after displaying
 */

import pty from '@homebridge/node-pty-prebuilt-multiarch';

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fspecDemo() {
  const fspecPath = '/Users/rquast/projects/fspec';

  console.log('🎬 Starting fspec demo...\n');

  // Create a PTY for fspec
  const ptyProcess = pty.spawn('npx', ['fspec'], {
    name: 'xterm-256color',
    cols: 120,
    rows: 30,
    cwd: fspecPath,
    env: {
      ...process.env,
      FORCE_COLOR: '1',
      TERM: 'xterm-256color',
    },
  });

  // Pipe output to stdout
  ptyProcess.onData((data) => {
    process.stdout.write(data);
  });

  // Wait for fspec to fully render (10 seconds)
  // The TUI takes time to load and render all elements
  console.log('Waiting for TUI to load...\n');
  await sleep(10000);

  // Navigate down with arrow key
  console.log('Navigating down...');
  ptyProcess.write('\x1B[B'); // Down arrow
  await sleep(1000);

  ptyProcess.write('\x1B[B'); // Down arrow
  await sleep(1000);

  // Navigate right with arrow key
  console.log('Navigating right...');
  ptyProcess.write('\x1B[C'); // Right arrow
  await sleep(1000);

  // Press Enter to view details
  console.log('Viewing details...');
  ptyProcess.write('\r'); // Enter
  await sleep(2000);

  // Press ESC to go back
  console.log('Going back...');
  ptyProcess.write('\x1b'); // ESC
  await sleep(1000);

  // Send ESC key to quit fspec (ESC = \x1b)
  console.log('Exiting...');
  ptyProcess.write('\x1b');

  // Wait for graceful exit
  await sleep(500);

  // Return promise that resolves on exit
  return new Promise<void>((resolve) => {
    ptyProcess.onExit(() => {
      console.log('\n✅ Demo completed!\n');
      resolve();
    });
  });
}

// Export for recorder
export default fspecDemo;

// Run the demo if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fspecDemo().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
