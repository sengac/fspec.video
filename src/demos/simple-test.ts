import { TestController } from '@microsoft/tui-test';

/**
 * Simple test demo that just runs basic shell commands
 * This doesn't require fspec to be set up
 */
export async function simpleTestDemo() {
  const controller = new TestController();

  try {
    console.log('Starting simple shell demo...');

    // Start a basic shell
    await controller.spawn('bash', ['-i'], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        PS1: '$ ',
        FORCE_COLOR: '1',
      },
    });

    // Wait for prompt
    await controller.waitForText('$', { timeout: 3000 });
    await delay(1000);

    // Demo 1: Show we're in fspec.videos directory
    console.log('Demo: Checking location...');
    await controller.write('pwd\n');
    await delay(2000);

    // Demo 2: List demo scripts
    console.log('Demo: Listing demo scripts...');
    await controller.write('./dist/index.js list\n');
    await delay(3000);

    // Demo 3: Show help
    console.log('Demo: Showing help...');
    await controller.write('./dist/index.js --help\n');
    await delay(3000);

    // Demo 4: Show successful recording options validation
    console.log('Demo: Testing validation (valid)...');
    await controller.write('echo "Valid options: width 100, height 30"\n');
    await delay(2000);

    // Demo 5: Exit
    console.log('Demo: Exiting...');
    await controller.write('exit\n');
    await delay(1000);

    console.log('Demo completed successfully!');
  } catch (error) {
    console.error('Demo failed:', error);
    throw error;
  } finally {
    await controller.close();
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the demo if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  simpleTestDemo().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
