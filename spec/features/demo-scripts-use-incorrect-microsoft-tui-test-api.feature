@done
@video-recording
@critical
@demos
@bug
@VID-007
Feature: Demo scripts use incorrect @microsoft/tui-test API
  """
  microsoft/tui-test is a test framework (like Vitest/Jest for terminals). Provides test() and expect() functions. Terminal instance passed as fixture. Uses node-pty for PTY and xterm headless for emulation. Demo scripts MUST be .test.ts files run by tui-test CLI, not standalone scripts. See attached docs/tui-test-usage-guide.md for complete migration guide.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. Demo scripts MUST be .test.ts files using test() and expect() from @microsoft/tui-test
  #   2. Demo scripts MUST access terminal via fixture: test('name', async ({ terminal }) => ...)
  #   3. Demo scripts MUST use terminal.submit(), terminal.write(), terminal.key*() methods
  #
  # EXAMPLES:
  #   1. Shell demo: test.use({ shell: Shell.Bash }); terminal.submit('ls');
  #   2. fspec TUI: test.use({ program: { file: 'node', args: ['fspec/dist/index.js'] } }); terminal.keyDown();
  #
  # ========================================
  Background: User Story
    As a developer using fspec.videos
    I want to write demo scripts using @microsoft/tui-test correctly
    So that I can create working demo videos of terminal applications

  Scenario: Shell demo script uses correct tui-test API
    Given I create a demo script as demos/shell-commands.test.ts
    When I import test, expect, and Shell from microsoft/tui-test
    And I use test.use({ shell: Shell.Bash }) to configure the shell
    And I write test('demo', async ({ terminal }) => {...}) with terminal fixture
    And I use terminal.submit('ls') to execute commands
    And I use await expect(terminal.getByText(...)).toBeVisible() for assertions
    Then the demo script uses correct tui-test API
    And the script can be run with tui-test CLI

  Scenario: fspec TUI demo script uses correct API
    Given I create a demo script as demos/fspec-navigation.test.ts
    When I use test.use({ program: { file: 'node', args: ['fspec/dist/index.js'] } })
    And I write test('demo', async ({ terminal }) => {...}) with terminal fixture
    And I use terminal.keyDown() for navigation
    And I use terminal.write() for key presses
    And I use await expect(terminal.getByText('fspec')).toBeVisible()
    Then the demo script controls the TUI correctly
    And the script uses terminal fixture methods
