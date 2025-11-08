@done
@validation
@cli
@critical
@VID-003
Feature: Recording options accept invalid values without validation
  """
  Validation logic added to recorder.ts before Puppeteer launch. Uses fs.access() to validate script file existence and output directory writability. Validates numeric ranges before passing to browser configuration. Error messages follow commander.js error handling conventions with chalk coloring.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. Terminal width must be a positive integer greater than 0
  #   2. Terminal height must be a positive integer greater than 0
  #   3. FPS must be a positive integer between 1 and 120
  #   4. Script path must point to an existing TypeScript file
  #   5. Validation errors must provide clear, actionable error messages
  #   6. Yes, set maximum width to 300 and maximum height to 100 (reasonable terminal sizes)
  #   7. Yes, validate that output directory exists or can be created before starting recording
  #
  # EXAMPLES:
  #   1. User runs record with width=-1, receives error: 'Width must be greater than 0'
  #   2. User runs record with height=0, receives error: 'Height must be greater than 0'
  #   3. User runs record with fps=200, receives error: 'FPS must be between 1 and 120'
  #   4. User runs record with non-existent script, receives error: 'Script file not found: path/to/script.ts'
  #   5. User runs record with valid options (width=120, height=30, fps=30), validation passes
  #   6. User runs record with width=400, receives error: 'Width must be between 1 and 300'
  #   7. User runs record with height=150, receives error: 'Height must be between 1 and 100'
  #   8. User runs record with output='/invalid/readonly/path.webm', receives error: 'Output directory is not writable or cannot be created'
  #
  # QUESTIONS (ANSWERED):
  #   Q: Should we set maximum limits for width and height to prevent performance issues?
  #   A: true
  #
  #   Q: Should we validate that the output directory exists or is writable before starting recording?
  #   A: true
  #
  # ========================================
  Background: User Story
    As a developer using fspec-videos
    I want to provide valid recording options
    So that the tool prevents errors and provides clear feedback when options are invalid

  Scenario: Reject negative terminal width
    Given I want to record a demo video
    When I run the record command with width set to -1
    Then the command should fail with error "Width must be greater than 0"
    And no recording should be started

  Scenario: Reject zero terminal height
    Given I want to record a demo video
    When I run the record command with height set to 0
    Then the command should fail with error "Height must be greater than 0"
    And no recording should be started

  Scenario: Reject FPS above maximum
    Given I want to record a demo video
    When I run the record command with fps set to 200
    Then the command should fail with error "FPS must be between 1 and 120"
    And no recording should be started

  Scenario: Reject non-existent script file
    Given I want to record a demo video
    When I run the record command with a non-existent script path
    Then the command should fail with error containing "Script file not found"
    And no recording should be started

  Scenario: Accept valid recording options
    Given I want to record a demo video
    And I have a valid demo script file
    When I run the record command with width 120, height 30, and fps 30
    Then the validation should pass
    And the recording should start

  Scenario: Reject terminal width above maximum
    Given I want to record a demo video
    When I run the record command with width set to 400
    Then the command should fail with error "Width must be between 1 and 300"
    And no recording should be started

  Scenario: Reject terminal height above maximum
    Given I want to record a demo video
    When I run the record command with height set to 150
    Then the command should fail with error "Height must be between 1 and 100"
    And no recording should be started

  Scenario: Reject invalid output directory
    Given I want to record a demo video
    When I run the record command with an unwritable output path
    Then the command should fail with error containing "Output directory is not writable"
    And no recording should be started
