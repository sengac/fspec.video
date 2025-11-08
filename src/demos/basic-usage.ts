import { TestController } from '@microsoft/tui-test';
import { homedir } from 'os';
import { join } from 'path';

/**
 * Basic usage demo for fspec TUI
 * This script demonstrates common fspec commands and navigation
 */
export async function basicUsageDemo() {
  // Path to fspec executable
  const fspecPath = join(homedir(), 'projects', 'fspec', 'dist', 'index.js');

  // Create a test controller
  const controller = new TestController();

  try {
    // Start the fspec TUI
    console.log('Starting fspec TUI...');
    await controller.spawn(process.execPath, [fspecPath], {
      cwd: join(homedir(), 'projects', 'fspec'),
      env: {
        ...process.env,
        FORCE_COLOR: '1',
      },
    });

    // Wait for the TUI to load
    await controller.waitForText('fspec', { timeout: 5000 });
    await delay(1000);

    // Demo 1: Show the help screen
    console.log('Demo: Showing help screen...');
    await controller.write('?');
    await delay(2000);
    await controller.write('\x1b'); // ESC to close help

    // Demo 2: Navigate through work units
    console.log('Demo: Navigating work units...');
    await delay(1000);
    await controller.write('j'); // Move down
    await delay(500);
    await controller.write('j'); // Move down
    await delay(500);
    await controller.write('j'); // Move down
    await delay(500);
    await controller.write('k'); // Move up
    await delay(500);

    // Demo 3: Open a work unit
    console.log('Demo: Opening work unit...');
    await controller.write('\r'); // Enter to open
    await delay(2000);

    // Demo 4: Navigate back
    console.log('Demo: Navigating back...');
    await controller.write('\x1b'); // ESC to go back
    await delay(1000);

    // Demo 5: Search functionality (if available)
    console.log('Demo: Search...');
    await controller.write('/'); // Start search
    await delay(500);
    await controller.write('feature');
    await delay(1000);
    await controller.write('\r'); // Confirm search
    await delay(2000);

    // Demo 6: Exit
    console.log('Demo: Exiting...');
    await controller.write('q'); // Quit
    await delay(1000);

    console.log('Demo completed successfully!');
  } catch (error) {
    console.error('Demo failed:', error);
    throw error;
  } finally {
    // Clean up
    await controller.close();
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the demo if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  basicUsageDemo().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
