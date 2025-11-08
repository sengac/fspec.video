import { TestController } from '@microsoft/tui-test';
import { homedir } from 'os';
import { join } from 'path';

/**
 * Kanban workflow demo for fspec TUI
 * Demonstrates moving work units through different states
 */
export async function kanbanWorkflowDemo() {
  const fspecPath = join(homedir(), 'projects', 'fspec', 'dist', 'index.js');
  const controller = new TestController();

  try {
    console.log('Starting fspec TUI for Kanban workflow demo...');
    await controller.spawn(process.execPath, [fspecPath], {
      cwd: join(homedir(), 'projects', 'fspec'),
      env: {
        ...process.env,
        FORCE_COLOR: '1',
      },
    });

    await controller.waitForText('fspec', { timeout: 5000 });
    await delay(1500);

    // Demo: Show Kanban board
    console.log('Demo: Opening Kanban board...');
    await controller.write('k'); // Open Kanban view (if available)
    await delay(2000);

    // Demo: Select a work unit
    console.log('Demo: Selecting work unit...');
    await controller.write('j'); // Move down
    await delay(500);
    await controller.write('\r'); // Select
    await delay(1000);

    // Demo: Move to In Progress
    console.log('Demo: Moving to In Progress...');
    await controller.write('i'); // Move to In Progress (example command)
    await delay(2000);

    // Demo: View details
    console.log('Demo: Viewing details...');
    await controller.write('\r'); // Open details
    await delay(2000);

    // Demo: Move to Testing
    console.log('Demo: Moving to Testing...');
    await controller.write('t'); // Move to Testing
    await delay(2000);

    // Demo: Complete the work unit
    console.log('Demo: Completing work unit...');
    await controller.write('c'); // Complete
    await delay(2000);

    // Exit
    console.log('Demo: Exiting...');
    await controller.write('q');
    await delay(1000);

    console.log('Kanban workflow demo completed!');
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
  kanbanWorkflowDemo().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
