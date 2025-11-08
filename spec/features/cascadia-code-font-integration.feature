@done
@critical
@video-recording
@recorder
@VID-012
Feature: Cascadia Code Font Integration

  """
  Architecture notes:
  - Uses @fontsource/cascadia-code npm package for font delivery
  - Font loaded via CSS @font-face in server.ts getTerminalHTML() function
  - Express server serves font files from node_modules/@fontsource/cascadia-code
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. Cascadia Code font files must be bundled with the project as a dependency
  #   2. Font must be loaded via CSS @font-face in the terminal HTML
  #   3. Cascadia Code should be the first font in the xterm.js fontFamily setting
  #
  # EXAMPLES:
  #   1. When page loads, browser downloads Cascadia Code font files from local project assets
  #   2. When xterm.js renders text, it uses Cascadia Code font instead of Courier New
  #   3. When checking package.json, @fontsource/cascadia-code is listed as a dependency
  #
  # QUESTIONS (ANSWERED):
  #   Q: Do you want any specific font weight/variant of Cascadia Code (e.g., regular, bold, light) or just the default?
  #   A: true
  #
  # ========================================

  Background: User Story
    As a developer using fspec videos
    I want to see terminal output rendered in Cascadia Code font
    So that I get better readability and a modern monospace font appearance

  Scenario: Install Cascadia Code font as project dependency
    Given I have a Node.js project with package.json
    When I install @fontsource/cascadia-code
    Then package.json should list @fontsource/cascadia-code as a dependency
    And the font files should be available in node_modules/@fontsource/cascadia-code

  Scenario: Configure Express server to serve font files
    Given Cascadia Code is installed as a dependency
    When the Express server starts
    Then it should serve static font files from node_modules/@fontsource/cascadia-code
    And the terminal HTML page should include CSS @font-face declarations

  Scenario: Configure xterm.js to use Cascadia Code font
    Given the terminal HTML includes Cascadia Code @font-face declarations
    When xterm.js terminal is initialized
    Then the fontFamily setting should have "Cascadia Code" as the first font
    And the terminal should render text using Cascadia Code instead of fallback fonts
