@done
@demo-system
@high
@web
@xterm
@interactive-terminal
@TERM-001
Feature: fspec in xterm.js web interface
  """
  Architecture notes:
  - Create standalone Express server (server-fspec.ts) separate from video recording server
  - Use node-pty to spawn real shell backend for executing fspec commands interactively
  - Match existing server.ts configuration: Cascadia Code font, 96px fontSize, 120x30 terminal size, same theme colors

  Dependencies:
  - express: HTTP server
  - @xterm/xterm: Terminal UI component
  - @homebridge/node-pty-prebuilt-multiarch: PTY for real shell backend
  - @fontsource/cascadia-code: Cascadia Code font files
  - socket.io: WebSocket communication between terminal and shell
  - open: Auto-open browser

  Critical implementation requirements:
  - Server listens on fixed port 3000
  - Serves Cascadia Code fonts from /fonts endpoint
  - Establishes WebSocket connection for terminal I/O
  - Spawns shell process using node-pty with proper environment
  - Auto-opens browser on server start
  - Handles terminal resize events
  - Properly cleans up PTY process on disconnect
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. Server must use the same Cascadia Code font configuration as the existing video recording system
  #   2. Server must be accessible via 'npm run server:fspec' command
  #   3. Terminal must support interactive command execution with real shell backend
  #   4. xterm.js configuration must match existing server.ts settings (fontSize: 96, cols: 120, rows: 30, theme colors)
  #
  # EXAMPLES:
  #   1. Developer runs 'npm run server:fspec', server starts on port 3000, browser opens to http://localhost:3000 showing xterm.js terminal
  #   2. Terminal displays with Cascadia Code font at 96px, 120 cols x 30 rows, matching existing video system appearance
  #   3. User types 'fspec board' in terminal, command executes via node-pty, real output streams back to xterm.js
  #   4. User types 'fspec list-work-units', sees actual work units from project's spec/ directory displayed with formatting
  #   5. Server serves Cascadia Code fonts from /fonts endpoint, @font-face CSS loaded in HTML, terminal renders with ligatures
  #
  # QUESTIONS (ANSWERED):
  #   Q: Should the terminal connect to a real shell backend (using node-pty) or just simulate command output for demo purposes?
  #   A: true
  #
  #   Q: What port should the server run on? Random port like existing server (port 0) or fixed port like 3000?
  #   A: true
  #
  #   Q: Should this be a standalone server or integrate with the existing server.ts? Create new file or extend existing?
  #   A: true
  #
  #   Q: Do you want the server to auto-open the browser when started, or just print the URL?
  #   A: true
  #
  # ========================================
  Background: User Story
    As a developer testing fspec
    I want to run fspec commands in a web-based terminal
    So that I can test and demonstrate fspec functionality in a browser environment

  Scenario: Start fspec web terminal server
    Given I have an fspec project with package.json
    When I run "npm run server:fspec"
    Then the server should start on port 3000
    And the browser should automatically open to http://localhost:3000
    And the console should display "Server listening on http://localhost:3000"
    And the page should load an xterm.js terminal

  Scenario: Display terminal with Cascadia Code font configuration
    Given the fspec web terminal server is running
    When I open http://localhost:3000 in a browser
    Then the terminal should be rendered using xterm.js
    And the terminal should use Cascadia Code font at 96px
    And the terminal should have 120 columns and 30 rows
    And the terminal should have the same theme colors as the video recording system
    And the font should be served from the /fonts endpoint

  Scenario: Execute fspec command in interactive terminal
    Given the fspec web terminal is loaded in the browser
    And the terminal is connected to a real shell via node-pty
    When I type "fspec board" and press Enter
    Then the command should execute in the shell backend
    And the output should stream back to the xterm.js terminal
    And I should see the Kanban board displayed with formatting

  Scenario: Execute fspec list command in terminal
    Given the fspec web terminal is connected to a shell
    When I type "fspec list-work-units" and press Enter
    Then the command should execute via node-pty
    And I should see the actual work units from the project's spec/ directory
    And the output should include ANSI formatting and colors
    And the terminal should render the output correctly

  Scenario: Serve Cascadia Code font files
    Given the fspec web terminal server is running
    When the browser requests /fonts/cascadia-code-latin-400-normal.woff2
    Then the server should serve the font file from node_modules/@fontsource/cascadia-code/files
    And the response should have the correct Content-Type header
    And the HTML should include @font-face CSS declarations
    And the terminal should render text with Cascadia Code ligatures
