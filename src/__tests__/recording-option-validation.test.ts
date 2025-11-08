/**
 * Feature: spec/features/recording-option-validation.feature
 *
 * Tests for recording option validation
 */

import { describe, it, expect } from 'vitest';
import { validateRecordingOptions } from '../validator.js';

describe('Feature: Recording option validation', () => {
  describe('Scenario: Reject negative terminal width', () => {
    it('should reject negative width with clear error message', async () => {
      // @step Given I want to record a demo video
      const options = {
        scriptPath: 'test-script.ts',
        outputPath: 'test.webm',
        height: 30,
        fps: 30,
        headless: true,
      };

      // @step When I run the record command with width set to -1
      options.width = -1;

      // @step Then the command should fail with error "Width must be greater than 0"
      await expect(validateRecordingOptions(options as any)).rejects.toThrow(
        'Width must be greater than 0'
      );

      // @step And no recording should be started
      // (validation prevents recording from starting)
    });
  });

  describe('Scenario: Reject zero terminal height', () => {
    it('should reject zero height with clear error message', async () => {
      // @step Given I want to record a demo video
      const options = {
        scriptPath: 'test-script.ts',
        outputPath: 'test.webm',
        width: 120,
        fps: 30,
        headless: true,
      };

      // @step When I run the record command with height set to 0
      options.height = 0;

      // @step Then the command should fail with error "Height must be greater than 0"
      await expect(validateRecordingOptions(options as any)).rejects.toThrow(
        'Height must be greater than 0'
      );

      // @step And no recording should be started
      // (validation prevents recording from starting)
    });
  });

  describe('Scenario: Reject FPS above maximum', () => {
    it('should reject FPS above 120 with clear error message', async () => {
      // @step Given I want to record a demo video
      const options = {
        scriptPath: 'test-script.ts',
        outputPath: 'test.webm',
        width: 120,
        height: 30,
        headless: true,
      };

      // @step When I run the record command with fps set to 200
      options.fps = 200;

      // @step Then the command should fail with error "FPS must be between 1 and 120"
      await expect(validateRecordingOptions(options as any)).rejects.toThrow(
        'FPS must be between 1 and 120'
      );

      // @step And no recording should be started
      // (validation prevents recording from starting)
    });
  });

  describe('Scenario: Reject non-existent script file', () => {
    it('should reject non-existent script with clear error message', async () => {
      // @step Given I want to record a demo video
      const options = {
        scriptPath: 'non-existent-script.ts',
        outputPath: 'test.webm',
        width: 120,
        height: 30,
        fps: 30,
        headless: true,
      };

      // @step When I run the record command with a non-existent script path
      // (options.scriptPath is already non-existent)

      // @step Then the command should fail with error containing "Script file not found"
      await expect(validateRecordingOptions(options as any)).rejects.toThrow(
        /Script file not found/
      );

      // @step And no recording should be started
      // (validation prevents recording from starting)
    });
  });

  describe('Scenario: Accept valid recording options', () => {
    it('should accept valid options and allow recording to start', async () => {
      // @step Given I want to record a demo video
      // @step And I have a valid demo script file
      const options = {
        scriptPath: 'src/demos/basic-usage.ts',
        outputPath: 'test.webm',
        width: 120,
        height: 30,
        fps: 30,
        headless: true,
      };

      // @step When I run the record command with width 120, height 30, and fps 30
      // (options already set with valid values)

      // @step Then the validation should pass
      await expect(validateRecordingOptions(options as any)).resolves.toBeUndefined();

      // @step And the recording should start
      // (validation passing allows recording to proceed)
    });
  });

  describe('Scenario: Reject terminal width above maximum', () => {
    it('should reject width above 300 with clear error message', async () => {
      // @step Given I want to record a demo video
      const options = {
        scriptPath: 'test-script.ts',
        outputPath: 'test.webm',
        height: 30,
        fps: 30,
        headless: true,
      };

      // @step When I run the record command with width set to 400
      options.width = 400;

      // @step Then the command should fail with error "Width must be between 1 and 300"
      await expect(validateRecordingOptions(options as any)).rejects.toThrow(
        'Width must be between 1 and 300'
      );

      // @step And no recording should be started
      // (validation prevents recording from starting)
    });
  });

  describe('Scenario: Reject terminal height above maximum', () => {
    it('should reject height above 100 with clear error message', async () => {
      // @step Given I want to record a demo video
      const options = {
        scriptPath: 'test-script.ts',
        outputPath: 'test.webm',
        width: 120,
        fps: 30,
        headless: true,
      };

      // @step When I run the record command with height set to 150
      options.height = 150;

      // @step Then the command should fail with error "Height must be between 1 and 100"
      await expect(validateRecordingOptions(options as any)).rejects.toThrow(
        'Height must be between 1 and 100'
      );

      // @step And no recording should be started
      // (validation prevents recording from starting)
    });
  });

  describe('Scenario: Reject invalid output directory', () => {
    it('should reject unwritable output directory with clear error message', async () => {
      // @step Given I want to record a demo video
      const options = {
        scriptPath: 'src/demos/basic-usage.ts', // Use existing script file
        outputPath: '/invalid/readonly/path.webm',
        width: 120,
        height: 30,
        fps: 30,
        headless: true,
      };

      // @step When I run the record command with an unwritable output path
      // (options.outputPath is already set to unwritable path)

      // @step Then the command should fail with error containing "Output directory is not writable"
      await expect(validateRecordingOptions(options as any)).rejects.toThrow(
        /Output directory is not writable/
      );

      // @step And no recording should be started
      // (validation prevents recording from starting)
    });
  });
});
