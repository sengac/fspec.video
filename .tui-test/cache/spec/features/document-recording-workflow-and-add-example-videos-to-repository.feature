@done
@cli
@feature-management
@documentation
@critical
@VID-006
Feature: Document recording workflow and add example videos to repository
  """
  Create comprehensive README.md in project root with installation, usage, configuration, and examples. Include code snippets users can copy-paste. Document all CLI commands, recording options, and config file format. No actual video files in repo (too large), just documentation on how to record.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. README.md must exist in project root
  #   2. README must include installation instructions (npm install)
  #   3. README must document all CLI commands (record, list)
  #   4. README must document configuration file format and options
  #   5. README must include working examples that users can copy-paste
  #
  # EXAMPLES:
  #   1. README has Installation section with npm install command
  #   2. README shows example: 'fspec-videos record -s src/demos/basic-usage.ts'
  #   3. README shows config file example with width, height, fps options
  #
  # QUESTIONS (ANSWERED):
  #   Q: What specific documentation files should be created? (README, usage guide, API docs, etc.)
  #   A: true
  #
  #   Q: Should we include example recorded videos in the repository or just document how to record them?
  #   A: true
  #
  #   Q: What key sections should the README include?
  #   A: true
  #
  # ========================================
  Background: User Story
    As a developer wanting to use fspec-videos
    I want to have clear documentation on how to install and use the tool
    So that I can quickly get started without having to read the source code

  Scenario: README includes installation instructions
    Given I want to install and use fspec-videos
    When I read the README.md file
    Then I should see an Installation section
    And the section should include npm install command

  Scenario: README documents CLI commands with examples
    Given I want to record a demo video
    When I read the README.md file
    Then I should see examples of the record command
    And I should see the example: fspec-videos record -s src/demos/basic-usage.ts
    And I should see documentation for the list command

  Scenario: README documents configuration file format
    Given I want to use a configuration file
    When I read the README.md file
    Then I should see a Configuration section
    And I should see an example config file with width, height, and fps options
    And I should see an explanation of how CLI options override config values
