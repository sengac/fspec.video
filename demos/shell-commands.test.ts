// Copyright (c) fspec.videos
// Demo: Shell commands using tui-test framework

import { test, expect, Shell } from '@microsoft/tui-test';

test.use({ shell: Shell.Bash });

test('demonstrate shell commands', async ({ terminal }) => {
  // Wait for shell prompt
  await expect(terminal.getByText('$', { full: true })).toBeVisible({ timeout: 5000 });

  // Show current directory
  terminal.submit('pwd');
  await expect(terminal.getByText('fspec.videos', { full: true })).toBeVisible({ timeout: 3000 });

  // List files
  terminal.submit('ls');
  await expect(terminal.getByText('package.json', { full: true })).toBeVisible({ timeout: 3000 });

  // Show package name
  terminal.submit('cat package.json | grep "name"');
  await expect(terminal.getByText('fspec-videos', { full: true })).toBeVisible({ timeout: 3000 });

  // Exit shell
  terminal.submit('exit');
});
