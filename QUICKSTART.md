# Quick Start Guide

## Installation

```bash
npm install
```

## Building

```bash
npm run build
```

## Recording a Demo Video

### Method 1: Using the built CLI

```bash
npm run build
./dist/index.js record -s src/demos/basic-usage.ts -o recordings/my-demo.webm
```

### Method 2: Using vite-node (Development)

```bash
npm run record -- record -s src/demos/basic-usage.ts -o recordings/my-demo.webm
```

### Available Demo Scripts

1. **Basic Usage** (`src/demos/basic-usage.ts`)
   - Shows basic fspec TUI navigation and commands
   - Good for first-time viewers

2. **Kanban Workflow** (`src/demos/kanban-workflow.ts`)
   - Demonstrates moving work units through different states
   - Shows the Kanban board functionality

3. **Spec Review** (`src/demos/spec-review.ts`)
   - Reviews feature specifications and acceptance criteria
   - Shows detailed spec navigation

## Recording Options

```bash
fspec-videos record [options]

Options:
  -s, --script <path>     Path to the demo script file (required)
  -o, --output <path>     Output video file path (default: "recordings/demo.webm")
  -w, --width <number>    Terminal width in columns (default: "120")
  -h, --height <number>   Terminal height in rows (default: "30")
  --fps <number>          Frames per second (default: "30")
  --no-headless           Run browser in non-headless mode (for debugging)
```

## Creating Your Own Demo Script

Create a new file in `src/demos/` directory:

```typescript
import { TestController } from '@microsoft/tui-test';
import { homedir } from 'os';
import { join } from 'path';

export async function myCustomDemo() {
  const fspecPath = join(homedir(), 'projects', 'fspec', 'dist', 'index.js');
  const controller = new TestController();

  try {
    await controller.spawn(process.execPath, [fspecPath], {
      cwd: join(homedir(), 'projects', 'fspec'),
      env: {
        ...process.env,
        FORCE_COLOR: '1',
      },
    });

    await controller.waitForText('fspec', { timeout: 5000 });

    // Your demo steps here
    await controller.write('j'); // Move down
    await delay(500);

    await controller.write('q'); // Quit
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

if (import.meta.url === \`file://\${process.argv[1]}\`) {
  myCustomDemo().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
```

## Troubleshooting

### Browser not found

If you get an error about Chromium not being found:

```bash
npx puppeteer browsers install chrome
```

### Permission denied

If you get a permission error when running the built CLI:

```bash
chmod +x dist/index.js
```

### Node version issues

The @microsoft/tui-test package requires Node.js 16.6.0 - 20.x. If you're using Node.js 21+, you may see warnings, but the package should still work.

## Tips

- Use `--no-headless` flag to see the browser window while recording (useful for debugging)
- Adjust `--width` and `--height` to match your desired terminal size
- Higher `--fps` values create smoother videos but larger file sizes
- Add `await delay(ms)` between actions to make the demo easier to follow
