// Copyright (c) fspec.videos
// Demo: fspec TUI navigation using tui-test framework

import { test, expect } from '@microsoft/tui-test';
import { join } from 'path';
import { homedir } from 'os';

const fspecPath = join(homedir(), 'projects', 'fspec', 'dist', 'index.js');

test.use({
  program: {
    file: process.execPath, // node
    args: [fspecPath]
  }
});

test('demonstrate fspec TUI navigation', async ({ terminal }) => {
  // Wait for fspec TUI to load
  await expect(terminal.getByText('fspec', { full: true })).toBeVisible({ timeout: 5000 });

  // Navigate down through work units
  terminal.keyDown();
  terminal.keyDown();
  terminal.keyDown();

  // Navigate back up
  terminal.keyUp();

  // Show help
  terminal.write('?');
  await expect(terminal.getByText('Help', { full: true })).toBeVisible({ timeout: 2000 });

  // Close help (ESC)
  terminal.keyEscape();

  // Quit (q)
  terminal.write('q');
});
