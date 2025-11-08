# fspec.videos

Demo video recorder for fspec TUI using @microsoft/tui-test

## Overview

This project allows you to record demo videos of the fspec TUI (Terminal User Interface) in action. It uses `@microsoft/tui-test` to script interactions with the fspec command-line tool and records them as video files using the MediaStream Recording API in a browser.

## Prerequisites

- Node.js >= 18.0.0
- fspec installed and available at `~/projects/fspec`

## Installation

```bash
npm install
```

## Usage

### Recording a Demo Video

Use the `record` command to create a video recording of a demo script:

```bash
fspec-videos record -s src/demos/basic-usage.ts
```

#### Recording Options

- `-s, --script <path>` - Path to the demo script file (required)
- `-o, --output <path>` - Output video file path (default: `recordings/demo.webm`)
- `-w, --width <number>` - Terminal width in columns (default: 120)
- `-h, --height <number>` - Terminal height in rows (default: 30)
- `--fps <number>` - Frames per second (default: 30)
- `--no-headless` - Run browser in non-headless mode for debugging

**Example with options:**

```bash
fspec-videos record -s src/demos/basic-usage.ts -o output.webm --width 100 --height 40 --fps 60
```

### Listing Available Demo Scripts

Use the `list` command to see all available demo scripts:

```bash
fspec-videos list
```

## Configuration

You can create a `fspec-videos.config.json` file in your project root to set default recording options:

```json
{
  "width": 100,
  "height": 40,
  "fps": 60,
  "outputPath": "recordings/my-demo.webm"
}
```

**CLI options override config file values.** For example, if your config has `width: 100` but you run with `--width 120`, the recording will use width 120.

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Testing

```bash
npm test
npm run test:watch
```

## Project Structure

```
fspec.videos/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── recorder.ts           # Video recording logic
│   ├── server.ts             # Express server for browser-based recording
│   └── demos/                # Demo scripts
│       └── basic-usage.ts    # Example demo script
├── recordings/               # Output directory for recordings
├── dist/                     # Build output
└── package.json
```

## How It Works

1. A demo script uses `@microsoft/tui-test` to interact with the fspec TUI
2. The TUI is rendered in a browser using xterm.js (since fspec uses xterm.js underneath)
3. The MediaStream Recording API captures the xterm.js terminal as a video
4. The recording is saved as a .webm or .mp4 file

## License

MIT
