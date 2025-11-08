#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { resolve, join } from 'path';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { startRecording } from './recorder.js';
import { validateRecordingOptions } from './validator.js';

interface ConfigFile {
  width?: number;
  height?: number;
  fps?: number;
  headless?: boolean;
  outputPath?: string;
  demosDir?: string;
}

export function loadConfigFile(cwd: string = process.cwd()): ConfigFile {
  const configPath = join(cwd, 'fspec-videos.config.json');

  if (!existsSync(configPath)) {
    return {}; // No config file, use empty config
  }

  try {
    const configContent = readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configContent);
    return config;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        `Failed to parse fspec-videos.config.json: Invalid JSON syntax\nConfig file location: ${configPath}`
      );
    }
    throw error;
  }
}

// Export for testing
export async function recordAction(
  options: any,
  cwd: string = process.cwd()
): Promise<void> {
  // Load config file
  const config = loadConfigFile(cwd);

  console.log(chalk.blue('🎬 Starting fspec video recording...'));
  console.log(chalk.gray(`Script: ${options.script}`));

  // Merge config with CLI options (CLI takes precedence)
  // Use CLI option if provided, otherwise use config, otherwise use default
  const width = options.width ? parseInt(options.width) : config.width ?? 120;
  const height = options.height
    ? parseInt(options.height)
    : config.height ?? 30;
  const fps = options.fps ? parseInt(options.fps) : config.fps ?? 30;
  const outputPath =
    options.output ?? config.outputPath ?? 'recordings/demo.webm';

  console.log(chalk.gray(`Output: ${outputPath}`));
  console.log(chalk.gray(`Terminal size: ${width}x${height} (${fps} FPS)`));

  const scriptPath = resolve(cwd, options.script);
  const resolvedOutputPath = resolve(cwd, outputPath);

  const recordingOptions = {
    scriptPath,
    outputPath: resolvedOutputPath,
    width,
    height,
    fps,
    headless: options.headless,
  };

  // Validate options before starting recording
  await validateRecordingOptions(recordingOptions);

  await startRecording(recordingOptions);

  console.log(chalk.green('✅ Recording completed successfully!'));
  console.log(chalk.gray(`Saved to: ${resolvedOutputPath}`));
}

const program = new Command();

program
  .name('fspec-videos')
  .description('Demo video recorder for fspec TUI using @microsoft/tui-test')
  .version('0.1.0');

program
  .command('record')
  .description('Record a demo video from a script')
  .requiredOption('-s, --script <path>', 'Path to the demo script file')
  .option('-o, --output <path>', 'Output video file path')
  .option('-w, --width <number>', 'Terminal width in columns')
  .option('-h, --height <number>', 'Terminal height in rows')
  .option('--fps <number>', 'Frames per second')
  .option('--no-headless', 'Run browser in non-headless mode (for debugging)')
  .action(async options => {
    try {
      await recordAction(options);
    } catch (error) {
      console.error(chalk.red('❌ Recording failed:'), error);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List available demo scripts')
  .action(() => {
    try {
      const demosDir = join(process.cwd(), 'src', 'demos');
      const files = readdirSync(demosDir);

      // Filter for TypeScript files and sort alphabetically
      const demoScripts = files
        .filter(file => file.endsWith('.ts'))
        .sort();

      console.log(chalk.blue('📋 Available demo scripts:'));
      demoScripts.forEach(script => {
        console.log(chalk.gray(`  - src/demos/${script}`));
      });

      console.log(
        chalk.gray('\nRun with: fspec-videos record -s src/demos/<script-name>.ts')
      );
    } catch (error) {
      console.error(chalk.red('❌ Failed to list demo scripts:'), error);
      process.exit(1);
    }
  });

// Only parse if running as main module (not imported in tests)
if (import.meta.url.startsWith('file:')) {
  const modulePath = new URL(import.meta.url).pathname;
  const scriptPath = process.argv[1];
  if (modulePath === scriptPath || modulePath.replace(/\.(js|ts)$/, '.js') === scriptPath) {
    program.parse(process.argv);
  }
}
