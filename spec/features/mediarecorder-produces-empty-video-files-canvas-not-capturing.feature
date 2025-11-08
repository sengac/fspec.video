@done
@critical
@video-recording
@demos
@bug
@VID-009
Feature: MediaRecorder produces empty video files - canvas not capturing

  """
  Uses Puppeteer browser automation with canvas.captureStream() and MediaRecorder API. xterm.js terminal uses differential rendering - only redraws canvas on content changes. MediaRecorder captures frames only during canvas repaints. Solution requires requestAnimationFrame loop synchronized to recording FPS to force continuous canvas redraws even when terminal content is static.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. Canvas captureStream() only captures frames when canvas is actively being painted
  #   2. MediaRecorder produces empty video files if no frames are painted to canvas after recording starts
  #   3. xterm.js uses differential rendering - only redraws canvas when terminal content changes
  #   4. Static terminal content means no canvas repaints means MediaRecorder gets zero frames
  #   5. MediaRecorder needs continuous canvas repaints to capture frames
  #   6. Solution requires requestAnimationFrame loop to force canvas redraws at recording FPS
  #   7. Animation loop must run at same FPS as MediaRecorder to ensure frame capture
  #
  # EXAMPLES:
  #   1. Demo script writes to terminal once then exits - video file is 0 bytes
  #   2. Use requestAnimationFrame to redraw canvas every frame (e.g. 30 FPS) even when terminal content unchanged
  #   3. Current code starts MediaRecorder but has no animation loop to force canvas redraws
  #   4. Add requestAnimationFrame loop that calls canvas.getContext('2d').getImageData() to force repaint
  #
  # ========================================

  Background: User Story
    As a developer using fspec.videos
    I want to record terminal demo videos that capture all frames
    So that I can create working demo videos without empty files

  Scenario: Empty video file when canvas not actively repainted
    Given I have a demo script that writes to terminal once then exits
    When I record the demo with MediaRecorder
    And the terminal canvas becomes static after initial output
    And MediaRecorder receives no canvas repaint events
    Then the recorded video file should be 0 bytes
    And the recording appears to complete successfully
    But the video contains no frames

  Scenario: Non-empty video file with continuous canvas repaints
    Given I have MediaRecorder capturing canvas stream at 30 FPS
    When I start a requestAnimationFrame loop
    And the loop forces canvas redraws every frame
    Then MediaRecorder should receive frames continuously
    And the recorded video file should have non-zero size
    And the video should contain captured frames

  Scenario: Add requestAnimationFrame loop to force canvas repaints
    Given the recorder starts MediaRecorder with canvas.captureStream()
    When I inject a requestAnimationFrame loop into the page
    And the loop calls canvas.getContext('2d').getImageData(0, 0, 1, 1)
    And the loop runs at the same FPS as MediaRecorder
    Then canvas repaints should occur continuously
    And MediaRecorder should capture frames successfully
    And recorded videos should be non-empty
