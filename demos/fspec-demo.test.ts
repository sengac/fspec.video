/**
 * fspec TUI Demo Script
 * This demo runs fspec with a PTY and automatically quits after displaying
 */

import pty from '@homebridge/node-pty-prebuilt-multiarch';

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
  const fspecPath = '/Users/rquast/projects/fspec';

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
  await sleep(10000);

  // Send ESC key to quit fspec (ESC = \x1b)
  ptyProcess.write('\x1b');

  // Wait for graceful exit
  await sleep(500);

  // Return promise that resolves on exit
  return new Promise<void>((resolve) => {
    ptyProcess.onExit(() => {
      resolve();
    });
  });
}

// Run demo
demo().catch(console.error);
