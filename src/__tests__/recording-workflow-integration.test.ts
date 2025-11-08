/**
 * Feature: spec/features/add-comprehensive-integration-tests-for-recording-workflow.feature
 *
 * Integration tests for complete recording workflow
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'fs';
import { join } from 'path';

// Mock the recorder module before any imports
vi.mock('../recorder.js', () => ({
  startRecording: vi.fn().mockResolvedValue(undefined),
}));

import { startRecording } from '../recorder.js';
import { recordAction } from '../index.js';
describe('Feature: Recording workflow integration', () => {
  const testDir = join(process.cwd(), '.test-integration');
  const configPath = join(testDir, 'fspec-videos.config.json');
  const scriptPath = join(process.cwd(), 'src', 'demos', 'basic-usage.ts');

  beforeEach(() => {
    if (!existsSync(testDir)) {
      mkdirSync(testDir, { recursive: true });
    }
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('Scenario: Integration test with valid config file', () => {
    it('should pass merged config options to recorder', async () => {
      // @step Given I have a config file with width 100 and height 40
      const config = {
        width: 100,
        height: 40,
      };
      writeFileSync(configPath, JSON.stringify(config, null, 2));

      // @step When I run the record command
      const options = {
        script: scriptPath,
        output: join(testDir, 'output.webm'),
        headless: true,
      };
      await recordAction(options, testDir);

      // @step Then the recorder module should be called with width 100 and height 40
      expect(startRecording).toHaveBeenCalledWith(
        expect.objectContaining({
          width: 100,
          height: 40,
        })
      );
    });
  });

  describe('Scenario: Integration test with CLI override', () => {
    it('should prioritize CLI options over config file', async () => {
      // @step Given I have a config file with width 100
      const config = {
        width: 100,
      };
      writeFileSync(configPath, JSON.stringify(config, null, 2));

      // @step When I run the record command with --width 120
      const options = {
        script: scriptPath,
        output: join(testDir, 'output.webm'),
        width: '120',
        headless: true,
      };
      await recordAction(options, testDir);

      // @step Then the recorder module should be called with width 120 from CLI
      expect(startRecording).toHaveBeenCalledWith(
        expect.objectContaining({
          width: 120,
        })
      );

      // @step And the config file width should be ignored
      // (Verified by the width being 120, not 100)
    });
  });

  describe('Scenario: Integration test with invalid config value', () => {
    it('should fail validation before calling recorder', async () => {
      // @step Given I have a config file with width 500
      const config = {
        width: 500,
      };
      writeFileSync(configPath, JSON.stringify(config, null, 2));

      // @step When I run the record command
      const options = {
        script: scriptPath,
        output: join(testDir, 'output.webm'),
        headless: true,
      };

      // @step Then validation should fail before recorder is called
      await expect(recordAction(options, testDir)).rejects.toThrow();
      expect(startRecording).not.toHaveBeenCalled();

      // @step And an error message should indicate width exceeds maximum
      await expect(recordAction(options, testDir)).rejects.toThrow(
        /Width must be between 1 and 300/
      );
    });
  });

  describe('Scenario: Integration test without config file', () => {
    it('should use default values when no config exists', async () => {
      // @step Given no config file exists in the project root
      // (No config file created in this test)

      // @step When I run the record command without options
      const options = {
        script: scriptPath,
        output: join(testDir, 'output.webm'),
        headless: true,
      };
      await recordAction(options, testDir);

      // @step Then the recorder module should be called with default values
      // @step And width should be 120
      // @step And height should be 30
      // @step And fps should be 30
      expect(startRecording).toHaveBeenCalledWith(
        expect.objectContaining({
          width: 120,
          height: 30,
          fps: 30,
        })
      );
    });
  });

  describe('Scenario: Integration test with invalid JSON in config', () => {
    it('should show parse error with config file path', async () => {
      // @step Given I have a config file with invalid JSON syntax
      writeFileSync(configPath, '{ invalid json }');

      // @step When I run the record command
      const options = {
        script: scriptPath,
        output: join(testDir, 'output.webm'),
        headless: true,
      };

      // @step Then a parse error should be shown
      await expect(recordAction(options, testDir)).rejects.toThrow();

      // @step And the error message should include the config file path
      await expect(recordAction(options, testDir)).rejects.toThrow(
        /fspec-videos\.config\.json/
      );
    });
  });
});
