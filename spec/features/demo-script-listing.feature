@done
@validation
@cli
@critical
@VID-002
Feature: List command only shows one demo script instead of all three
  """
  List command modified to use fs.readdir() to scan src/demos directory dynamically instead of hardcoded output. Uses path.join() to build full paths and filters for .ts files. Results sorted alphabetically before display. Integrated into existing commander.js list command in src/index.ts.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. List command must scan src/demos directory for all TypeScript files
  #   2. List command must display all found demo scripts in alphabetical order
  #   3. Each demo script must be displayed with its relative path from project root
  #   4. List command must show usage instructions with example fspec-videos record command
  #
  # EXAMPLES:
  #   1. User runs 'fspec-videos list' and sees all three demo scripts: basic-usage.ts, kanban-workflow.ts, spec-review.ts
  #   2. Demo scripts are displayed in alphabetical order
  #   3. Each script shows path 'src/demos/<filename>.ts'
  #   4. Output includes example usage: 'Run with: fspec-videos record -s src/demos/basic-usage.ts'
  #
  # ========================================
  Background: User Story
    As a developer using fspec-videos
    I want to list all available demo scripts
    So that I can discover and choose from all demo options

  Scenario: List all available demo scripts
    Given the src/demos directory contains three TypeScript demo files
    When I run the list command
    Then I should see all three demo scripts displayed
    And the scripts should include basic-usage.ts
    And the scripts should include kanban-workflow.ts
    And the scripts should include spec-review.ts

  Scenario: Demo scripts displayed in alphabetical order
    Given the src/demos directory contains multiple demo files
    When I run the list command
    Then the demo scripts should be listed in alphabetical order

  Scenario: Each script shows full relative path
    Given the src/demos directory contains demo files
    When I run the list command
    Then each script should display its path as "src/demos/<filename>.ts"

  Scenario: Display usage instructions
    Given I want to know how to use a demo script
    When I run the list command
    Then the output should include usage instructions
    And the instructions should show an example record command
