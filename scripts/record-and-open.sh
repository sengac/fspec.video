#!/bin/bash
set -e

echo "Starting recording..."

# Record the video using the built CLI
./dist/index.js record -s src/demos/fspec-demo.ts -o recordings/fspec-demo.webm

echo "Recording command completed with exit code: $?"

# Wait for file to exist and have size > 0
OUTPUT_FILE="recordings/fspec-demo.webm"
echo "Waiting for recording to complete..."
while [ ! -s "$OUTPUT_FILE" ]; do
  sleep 0.5
done

# Open the video
echo "Opening video..."
open "$OUTPUT_FILE"
