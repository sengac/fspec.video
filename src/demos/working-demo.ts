import { spawn } from 'child_process';

/**
 * Working demo that shows basic terminal commands
 * This demonstrates the recording infrastructure works
 */
export async function workingDemo() {
  console.log('Starting working demo...');

  // Create a simple shell process
  const shell = spawn('bash', ['-i'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PS1: '$ ',
      FORCE_COLOR: '1',
    },
  });

  // Helper to write to shell
  const write = (text: string) => {
    shell.stdin.write(text);
  };

  // Helper to wait
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  try {
    // Wait for shell to start
    await delay(1000);

    // Demo 1: Show we're in fspec.videos directory
    console.log('Demo: Checking location...');
    write('pwd\n');
    await delay(2000);

    // Demo 2: List demo scripts
    console.log('Demo: Listing files...');
    write('ls src/demos/\n');
    await delay(2000);

    // Demo 3: Show package.json name
    console.log('Demo: Showing project name...');
    write('cat package.json | grep "\\"name\\""\n');
    await delay(2000);

    // Demo 4: Show success message
    console.log('Demo: Showing completion...');
    write('echo "✅ fspec.videos recording demo complete!"\n');
    await delay(2000);

    // Demo 5: Exit
    console.log('Demo: Exiting...');
    write('exit\n');
    await delay(1000);

    // Wait for shell to exit
    await new Promise<void>((resolve, reject) => {
      shell.on('exit', (code) => {
        if (code === 0) {
          console.log('Demo completed successfully!');
          resolve();
        } else {
          reject(new Error(`Shell exited with code ${code}`));
        }
      });
    });
  } catch (error) {
    console.error('Demo failed:', error);
    shell.kill();
    throw error;
  }
}

// Run the demo if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  workingDemo().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
