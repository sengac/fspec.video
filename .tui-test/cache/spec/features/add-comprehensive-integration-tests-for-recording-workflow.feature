@done
@validation
@integration
@cli
@critical
@VID-005
Feature: Add comprehensive integration tests for recording workflow
  """
  Integration tests use vitest.mock() to mock startRecording() function from recorder.js. Tests verify complete workflow: CLI parsing → config file loading → option merging → validation → recorder invocation. Use real file system with temporary directories for config files. Verify recorder receives correctly merged and validated options without actually launching browser.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. Integration tests verify component integration, not individual component behavior
  #   2. Integration tests mock actual browser recording to keep tests fast
  #   3. Integration tests verify both success (happy path) and failure scenarios
  #   4. Tests must verify CLI options + config file merge with correct precedence (CLI wins)
  #   5. Tests must verify validation is applied to merged options, not just CLI or config alone
  #   6. Tests must verify error messages are clear and indicate the source of error (config vs validation vs recording)
  #
  # EXAMPLES:
  #   1. User runs record with valid config file (width=100, height=40), recorder module receives options with width=100, height=40
  #   2. User runs record with config width=100 and CLI --width=120, recorder receives width=120 (CLI override works)
  #   3. User runs record with config width=500 (invalid), validation error shown before recorder is called
  #   4. User runs record without config file, recorder receives default values (width=120, height=30, fps=30)
  #   5. User runs record with invalid JSON in config, error message shows config file path and parse error
  #
  # QUESTIONS (ANSWERED):
  #   Q: What specific integration scenarios should be tested? (e.g., end-to-end recording with config file, CLI override with validation, error handling across components)
  #   A: true
  #
  #   Q: Should integration tests actually produce video files, or should they mock the recording step and verify the workflow setup?
  #   A: true
  #
  #   Q: What are the critical integration points that must be tested? (e.g., config + CLI merge, merged options + validation, validated options + recorder)
  #   A: true
  #
  #   Q: Should we include both success and failure scenarios in integration tests?
  #   A: true
  #
  # ========================================
  Background: User Story
    As a developer maintaining fspec-videos
    I want to have integration tests that verify component integration
    So that I can catch integration bugs and ensure components work together correctly

  Scenario: Integration test with valid config file
    Given I have a config file with width 100 and height 40
    When I run the record command
    Then the recorder module should be called with width 100 and height 40

  Scenario: Integration test with CLI override
    Given I have a config file with width 100
    When I run the record command with --width 120
    Then the recorder module should be called with width 120 from CLI
    And the config file width should be ignored

  Scenario: Integration test with invalid config value
    Given I have a config file with width 500
    When I run the record command
    Then validation should fail before recorder is called
    And an error message should indicate width exceeds maximum

  Scenario: Integration test without config file
    Given no config file exists in the project root
    When I run the record command without options
    Then the recorder module should be called with default values
    And width should be 120
    And height should be 30
    And fps should be 30

  Scenario: Integration test with invalid JSON in config
    Given I have a config file with invalid JSON syntax
    When I run the record command
    Then a parse error should be shown
    And the error message should include the config file path
