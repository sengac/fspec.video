import { access, constants, mkdir } from 'fs/promises';
import { dirname } from 'path';

export interface RecordingOptions {
  scriptPath: string;
  outputPath: string;
  width: number;
  height: number;
  fps: number;
  headless: boolean;
}

/**
 * Validates recording options before starting the recording process
 * @throws Error if any validation fails
 */
export async function validateRecordingOptions(
  options: RecordingOptions
): Promise<void> {
  // Validate width
  if (options.width <= 0) {
    throw new Error('Width must be greater than 0');
  }
  if (options.width > 300) {
    throw new Error('Width must be between 1 and 300');
  }

  // Validate height
  if (options.height <= 0) {
    throw new Error('Height must be greater than 0');
  }
  if (options.height > 100) {
    throw new Error('Height must be between 1 and 100');
  }

  // Validate FPS
  if (options.fps < 1 || options.fps > 120) {
    throw new Error('FPS must be between 1 and 120');
  }

  // Validate script file exists
  try {
    await access(options.scriptPath, constants.R_OK);
  } catch {
    throw new Error(`Script file not found: ${options.scriptPath}`);
  }

  // Validate output directory exists or can be created
  const outputDir = dirname(options.outputPath);
  try {
    await access(outputDir, constants.W_OK);
  } catch {
    // Try to create the directory
    try {
      await mkdir(outputDir, { recursive: true });
    } catch {
      throw new Error(
        `Output directory is not writable or cannot be created: ${outputDir}`
      );
    }
  }
}
