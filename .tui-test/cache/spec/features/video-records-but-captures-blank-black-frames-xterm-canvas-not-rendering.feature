@critical
@recorder
@video-recording
@bug
@demos
@puppeteer
@xterm
@VID-010
Feature: Video records but captures blank/black frames - xterm canvas not rendering

  """
  Uses Puppeteer page.evaluate() to bridge demo script stdout to browser xterm.js terminal. Demo script runs as separate Node.js process (spawn), stdout captured via child.stdout.on('data'), then injected into browser via window.writeToTerminal() function exposed by server.ts. MediaRecorder captures frames using requestAnimationFrame loop with putImageData() to force canvas repaints. Critical: Demo script and browser terminal are separate processes - stdout capture + page.evaluate bridge is the only way to connect them.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. Demo script stdout must be captured and sent to browser terminal
  #   2. Browser xterm.js terminal must display all demo script output in real-time
  #   3. MediaRecorder must capture visible terminal content with demo output, not blank screens
  #   4. Demo script runs in Node.js process, browser terminal is separate - need communication bridge between them
  #
  # EXAMPLES:
  #   1. Demo script writes 'Hello World' to stdout → stdout captured by recorder → output sent to browser via page.evaluate() → browser terminal displays 'Hello World' → MediaRecorder captures visible content
  #   2. Demo script writes multiple lines with delays → each line captured as it's written → all lines sent to browser sequentially → terminal shows progressive output → video captures all lines in sequence
  #   3. Current broken behavior: Demo uses console.log() → output goes to Node.js stdout → browser terminal never receives output → terminal shows only '$ ' prompt → video captures blank screen with prompt
  #
  # ========================================

  Background: User Story
    As a developer using fspec.videos
    I want to record terminal demo videos that show actual terminal output
    So that I can create working demo videos with visible content instead of blank screens

  Scenario: Demo script stdout captured and displayed in browser terminal
    Given I have a demo script that writes "Hello World" to stdout
    When the recorder starts the demo script as a child process
    And stdout data is captured via child.stdout.on('data')
    And the captured output is sent to browser via page.evaluate(window.writeToTerminal)
    Then the browser xterm.js terminal should display "Hello World"
    And MediaRecorder should capture frames with visible "Hello World" text
    And the recorded video file should contain non-blank frames

  Scenario: Multiple lines with delays captured sequentially
    Given I have a demo script that writes multiple lines with delays between them
    When the recorder captures stdout for each line as it's written
    And each line is sent to browser terminal sequentially via page.evaluate()
    Then the browser terminal should show progressive output line by line
    And MediaRecorder should capture all lines in the correct sequence
    And the recorded video should show all terminal output

  Scenario: Current broken behavior - blank screen with only prompt
    Given the current recorder implementation does NOT capture demo stdout
    And demo script uses console.log() which writes to Node.js stdout
    When the demo script runs
    Then the browser terminal never receives the demo output
    And the terminal only shows the initial "$ " prompt
    And MediaRecorder captures blank frames with only the prompt visible
    And the recorded video shows a black screen with no demo content
