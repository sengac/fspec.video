@done
@validation
@cli
@critical
@VID-004
Feature: Support configuration file for demo script paths and recording defaults
  """
  Configuration file (fspec-videos.config.json) loaded from project root using fs.readFileSync() and JSON.parse(). Config merged with CLI options (CLI takes precedence). Validation applied to merged options using existing validateRecordingOptions(). Error handling for missing file (use defaults), invalid JSON (parse error), and invalid values (validation error).
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. JSON format (.json file)
  #   2. fspec-videos.config.json in project root
  #   3. Yes, CLI options override config file settings
  #   4. All recording options: width, height, fps, headless, outputPath, and demosDir
  #   5. Config file must be valid JSON format
  #   6. If config file doesn't exist, use built-in defaults
  #   7. Config file settings are validated using the same rules as CLI options
  #
  # EXAMPLES:
  #   1. User creates fspec-videos.config.json with default width=80, height=24, then runs record without --width/--height, recording uses 80x24
  #   2. User has config file with width=100, runs record with --width=120, recording uses 120 (CLI overrides config)
  #   3. User has invalid JSON in config file, receives clear error message about JSON syntax
  #   4. User has config with width=500 (exceeds max), receives same validation error as CLI would show
  #   5. No config file exists, record command uses built-in defaults (width=120, height=30, fps=30)
  #
  # QUESTIONS (ANSWERED):
  #   Q: What configuration file format should we use (JSON, YAML, .env)?
  #   A: true
  #
  #   Q: What should the default config file name and location be?
  #   A: true
  #
  #   Q: Should CLI options override config file settings?
  #   A: true
  #
  #   Q: What specific options should be configurable (width, height, fps, headless, output path, script path)?
  #   A: true
  #
  # ========================================
  Background: User Story
    As a developer using fspec-videos
    I want to configure default recording options in a file
    So that I don't have to specify the same options repeatedly on the command line

  Scenario: Use config file defaults for recording options
    Given I have a config file with width 80 and height 24
    When I run the record command without specifying width or height
    Then the recording should use width 80 and height 24 from the config file

  Scenario: CLI options override config file settings
    Given I have a config file with width 100
    When I run the record command with --width 120
    Then the recording should use width 120 from the CLI
    And the config file setting should be ignored

  Scenario: Reject invalid JSON in config file
    Given I have a config file with invalid JSON syntax
    When I run the record command
    Then the command should fail with a clear JSON parse error
    And the error message should indicate the config file location

  Scenario: Validate config file options same as CLI
    Given I have a config file with width 500
    When I run the record command
    Then the command should fail with the same validation error as CLI
    And the error should say "Width must be between 1 and 300"

  Scenario: Use built-in defaults when no config file exists
    Given no config file exists in the project root
    When I run the record command without options
    Then the recording should use built-in defaults
    And width should be 120
    And height should be 30
    And fps should be 30
