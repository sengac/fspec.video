import { TestController } from '@microsoft/tui-test';
import { homedir } from 'os';
import { join } from 'path';

/**
 * Specification review demo for fspec TUI
 * Demonstrates viewing and navigating feature specifications
 */
export async function specReviewDemo() {
  const fspecPath = join(homedir(), 'projects', 'fspec', 'dist', 'index.js');
  const controller = new TestController();

  try {
    console.log('Starting fspec TUI for specification review demo...');
    await controller.spawn(process.execPath, [fspecPath], {
      cwd: join(homedir(), 'projects', 'fspec'),
      env: {
        ...process.env,
        FORCE_COLOR: '1',
      },
    });

    await controller.waitForText('fspec', { timeout: 5000 });
    await delay(1500);

    // Demo: Navigate to a feature
    console.log('Demo: Navigating to feature...');
    await controller.write('j'); // Move down
    await delay(500);
    await controller.write('j');
    await delay(500);

    // Demo: Open feature details
    console.log('Demo: Opening feature details...');
    await controller.write('\r'); // Enter
    await delay(2000);

    // Demo: Scroll through scenarios
    console.log('Demo: Reviewing scenarios...');
    await controller.write('j'); // Scroll down
    await delay(800);
    await controller.write('j');
    await delay(800);
    await controller.write('j');
    await delay(800);

    // Demo: View acceptance criteria
    console.log('Demo: Viewing acceptance criteria...');
    await controller.write('a'); // Show acceptance criteria (example)
    await delay(2500);

    // Demo: View related work units
    console.log('Demo: Viewing related work units...');
    await controller.write('w'); // Show work units (example)
    await delay(2000);

    // Demo: Navigate back
    console.log('Demo: Going back...');
    await controller.write('\x1b'); // ESC
    await delay(1000);

    // Exit
    console.log('Demo: Exiting...');
    await controller.write('q');
    await delay(1000);

    console.log('Specification review demo completed!');
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

if (import.meta.url === `file://${process.argv[1]}`) {
  specReviewDemo().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
