@video-recording
@cli
@tui-test
@recorder
@demos
@critical
@VID-011
Feature: Create fspec demo video using correct tui-test API
  """
  Uses @microsoft/tui-test framework with test() and terminal fixture. Demo script is a .test.ts file run by tui-test CLI. Configured with test.use({ program: { file: 'node', args: [fspecPath] } }) to launch fspec TUI. Uses terminal.keyDown/keyUp/submit/keyEscape for navigation. Recording uses fspec-videos recorder with fontSize 96px and 4K viewport (3840x2160) for readable output.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. Demo script MUST be a .test.ts file using @microsoft/tui-test framework
  #   2. Demo MUST use test() function and terminal fixture, not TestController
  #   3. Demo MUST use test.use() to configure fspec TUI as the program
  #   4. Recording MUST produce readable 4K video with fontSize 96px
  #
  # EXAMPLES:
  #   1. Demo shows fspec TUI loading with work units visible
  #   2. Demo navigates through work units using arrow keys (terminal.keyDown/keyUp)
  #   3. Demo opens a work unit with Enter key (terminal.submit)
  #   4. Demo shows work unit details and navigates back with ESC (terminal.keyEscape)
  #   5. Recording produces FINAL-FSPEC-DEMO.webm in 4K with visible text
  #
  # ========================================
  Background: User Story
    As a developer wanting to understand fspec
    I want to watch a demo video of fspec TUI in action
    So that I can see how to navigate and use fspec effectively

  Scenario: Demo script uses correct tui-test API
    Given I have a demo script demos/fspec-demo.test.ts
    When I inspect the demo script
    Then it should import test and expect from @microsoft/tui-test
    And it should use test() function with terminal fixture
    And it should use test.use({ program: {...} }) to configure fspec TUI

  Scenario: Record fspec demo video with readable 4K output
    Given I have a working demo script demos/fspec-demo.test.ts
    When I record the demo using fspec-videos recorder
    Then a file recordings/FINAL-FSPEC-DEMO.webm should be created
    And the video should be 4K resolution (3840x2160)
    And the terminal text should be readable with fontSize 96px
    And the video should show fspec TUI navigation in action
