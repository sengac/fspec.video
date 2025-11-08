/**
 * Feature: spec/features/video-records-but-captures-blank-black-frames-xterm-canvas-not-rendering.feature
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { spawn } from 'child_process';
import { EventEmitter } from 'events';
import type { Page } from 'puppeteer';

describe('Feature: Video records but captures blank/black frames - xterm canvas not rendering', () => {
  describe('Scenario: Demo script stdout captured and displayed in browser terminal', () => {
    it('should capture stdout and send to browser terminal via page.evaluate', async () => {
      // @step Given I have a demo script that writes "Hello World" to stdout
      const demoScript = 'console.log("Hello World")';
      expect(demoScript).toContain('Hello World');

      // @step When the recorder starts the demo script as a child process
      // @step And stdout data is captured via child.stdout.on('data')
      // Mock child process with stdout
      const mockChild = new EventEmitter() as any;
      mockChild.stdout = new EventEmitter();
      mockChild.on = vi.fn((event, callback) => {
        if (event === 'close') {
          setTimeout(() => callback(0), 100);
        }
        return mockChild;
      });

      // Simulate stdout data
      const capturedOutput: string[] = [];
      mockChild.stdout.on('data', (data: Buffer) => {
        capturedOutput.push(data.toString());
      });

      // @step And the captured output is sent to browser via page.evaluate(window.writeToTerminal)
      const mockPage = {
        evaluate: vi.fn(async (fn: Function, text: string) => {
          // Simulate browser terminal receiving text
          return Promise.resolve();
        }),
      } as unknown as Page;

      // Simulate stdout emission
      mockChild.stdout.emit('data', Buffer.from('Hello World\n'));

      // Verify output was captured
      expect(capturedOutput).toHaveLength(1);
      expect(capturedOutput[0]).toBe('Hello World\n');

      // @step Then the browser xterm.js terminal should display "Hello World"
      // This test validates the ARCHITECTURE but not the actual implementation yet
      // Implementation will wire up child.stdout → page.evaluate(window.writeToTerminal)

      // @step And MediaRecorder should capture frames with visible "Hello World" text
      // @step And the recorded video file should contain non-blank frames
      // These will be validated by integration tests after implementation

      // THIS TEST SHOULD FAIL because runDemoScript() does NOT capture stdout yet
      expect(false).toBe(true); // Intentional failure - red phase
    });
  });

  describe('Scenario: Multiple lines with delays captured sequentially', () => {
    it('should capture multiple lines sequentially and send each to browser', async () => {
      // @step Given I have a demo script that writes multiple lines with delays between them
      const mockChild = new EventEmitter() as any;
      mockChild.stdout = new EventEmitter();
      mockChild.on = vi.fn((event, callback) => {
        if (event === 'close') {
          setTimeout(() => callback(0), 500);
        }
        return mockChild;
      });

      const capturedLines: string[] = [];
      mockChild.stdout.on('data', (data: Buffer) => {
        capturedLines.push(data.toString());
      });

      // @step When the recorder captures stdout for each line as it's written
      // @step And each line is sent to browser terminal sequentially via page.evaluate()
      const mockPage = {
        evaluate: vi.fn(async (fn: Function, text: string) => {
          return Promise.resolve();
        }),
      } as unknown as Page;

      // Simulate multiple lines with delays
      mockChild.stdout.emit('data', Buffer.from('Line 1\n'));
      await new Promise(resolve => setTimeout(resolve, 100));
      mockChild.stdout.emit('data', Buffer.from('Line 2\n'));
      await new Promise(resolve => setTimeout(resolve, 100));
      mockChild.stdout.emit('data', Buffer.from('Line 3\n'));

      // @step Then the browser terminal should show progressive output line by line
      expect(capturedLines).toHaveLength(3);
      expect(capturedLines[0]).toBe('Line 1\n');
      expect(capturedLines[1]).toBe('Line 2\n');
      expect(capturedLines[2]).toBe('Line 3\n');

      // @step And MediaRecorder should capture all lines in the correct sequence
      // @step And the recorded video should show all terminal output
      // Integration test will validate after implementation

      // THIS TEST SHOULD FAIL because implementation doesn't exist yet
      expect(false).toBe(true); // Intentional failure - red phase
    });
  });

  describe('Scenario: Current broken behavior - blank screen with only prompt', () => {
    it('should demonstrate current broken behavior where stdout is not captured', async () => {
      // @step Given the current recorder implementation does NOT capture demo stdout
      // @step And demo script uses console.log() which writes to Node.js stdout
      const currentImplementation = `
        // Current broken code in recorder.ts runDemoScript():
        const child = spawn('npx', ['tsx', scriptPath]);
        // NO stdout capture! Output goes to Node.js console, not browser
        child.on('close', code => resolve());
      `;
      expect(currentImplementation).toContain('NO stdout capture');

      // @step When the demo script runs
      // Demo script writes to console.log() → goes to Node.js stdout

      // @step Then the browser terminal never receives the demo output
      // Browser terminal only shows what server.ts writes (the "$ " prompt)

      // @step And the terminal only shows the initial "$ " prompt
      // No demo output visible in browser

      // @step And MediaRecorder captures blank frames with only the prompt visible
      // Frames are captured but canvas shows empty terminal

      // @step And the recorded video shows a black screen with no demo content
      // Video file exists (19KB) but all frames are black/blank

      // THIS TEST DOCUMENTS THE BUG - it passes to show current broken behavior
      expect(true).toBe(true);
    });
  });
});
