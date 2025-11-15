import express, { Express } from 'express';
import { createServer, Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { spawn as ptySpawn, IPty } from '@homebridge/node-pty-prebuilt-multiarch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import open from 'open';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;
const app: Express = express();
const httpServer: HTTPServer = createServer(app);
const io: SocketIOServer = new SocketIOServer(httpServer);

// Middleware to parse JSON
app.use(express.json());

// Store SSE clients
const streamClients: express.Response[] = [];
const tailClients: express.Response[] = [];

// Cumulative log for /tail endpoint
let cumulativeLog: string[] = [];
let lastProcessedLineCount = 0;

// Serve Cascadia Code font files from node_modules
app.use('/fonts', express.static(join(__dirname, '../node_modules/@fontsource/cascadia-code/files')));

// Serve the terminal HTML page
app.get('/', (_req, res) => {
  res.send(getTerminalHTML());
});

// Serve the stream viewer page
app.get('/stream', (_req, res) => {
  res.send(getStreamViewerHTML());
});

// Serve the tail viewer page
app.get('/tail-viewer', (_req, res) => {
  res.send(getTailViewerHTML());
});

// POST endpoint to receive terminal output from client
app.post('/terminal/output', (req, res) => {
  const { content, timestamp } = req.body;

  console.log(`Broadcasting to ${streamClients.length} clients`);

  // Broadcast to all SSE clients (viewport stream)
  streamClients.forEach(client => {
    client.write(`data: ${JSON.stringify({ content, timestamp })}\n\n`);
  });

  res.sendStatus(200);
});

// POST endpoint to receive incremental terminal lines for /tail
app.post('/terminal/tail', (req, res) => {
  const { lines, timestamp } = req.body;

  if (Array.isArray(lines) && lines.length > 0) {
    // Add timestamp to each line
    const timestampedLines = lines.map((line: string) => {
      const time = new Date(timestamp).toLocaleTimeString();
      return `[${time}] ${line}`;
    });

    // Append to cumulative log
    cumulativeLog.push(...timestampedLines);

    console.log(`Tail: Added ${lines.length} lines, total: ${cumulativeLog.length}`);

    // Broadcast new lines to all tail clients
    tailClients.forEach(client => {
      client.write(`data: ${JSON.stringify({ lines: timestampedLines, timestamp })}\n\n`);
    });
  }

  res.sendStatus(200);
});

// SSE endpoint to stream terminal output to browsers
app.get('/terminal/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: Date.now() })}\n\n`);

  // Add client to list
  streamClients.push(res);
  console.log(`SSE client connected. Total clients: ${streamClients.length}`);

  // Remove client when connection closes
  req.on('close', () => {
    const index = streamClients.indexOf(res);
    if (index !== -1) {
      streamClients.splice(index, 1);
      console.log(`SSE client disconnected. Total clients: ${streamClients.length}`);
    }
  });

  // Keep connection alive - don't end the response
  // The connection stays open until client disconnects
});

// SSE endpoint for cumulative tail log (append-only for LLM consumption)
app.get('/tail', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  // Send initial connection message with full cumulative log
  res.write(`data: ${JSON.stringify({ type: 'connected', fullLog: cumulativeLog, timestamp: Date.now() })}\n\n`);

  // Add client to list
  tailClients.push(res);
  console.log(`Tail client connected. Total tail clients: ${tailClients.length}`);

  // Remove client when connection closes
  req.on('close', () => {
    const index = tailClients.indexOf(res);
    if (index !== -1) {
      tailClients.splice(index, 1);
      console.log(`Tail client disconnected. Total tail clients: ${tailClients.length}`);
    }
  });

  // Keep connection alive
});

// Socket.io connection for terminal I/O
io.on('connection', (socket) => {
  console.log('Terminal client connected');

  // Spawn shell process using node-pty
  const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';
  const pty: IPty = ptySpawn(shell, [], {
    name: 'xterm-256color',
    cols: 120,
    rows: 30,
    cwd: process.cwd(),
    env: process.env as { [key: string]: string },
  });

  // Stream PTY output to terminal
  pty.onData((data) => {
    socket.emit('output', data);

    // Also capture for /tail endpoint
    // Split by newlines and add to cumulative log
    const lines = data.split('\n').filter(line => line.trim().length > 0);
    if (lines.length > 0) {
      const timestamp = Date.now();
      const timestampedLines = lines.map((line: string) => {
        const time = new Date(timestamp).toLocaleTimeString();
        return `[${time}] ${line}`;
      });

      cumulativeLog.push(...timestampedLines);

      // Broadcast to tail clients
      tailClients.forEach(client => {
        try {
          client.write(`data: ${JSON.stringify({ lines: timestampedLines, timestamp })}\n\n`);
        } catch (err) {
          console.error('Error writing to tail client:', err);
        }
      });
    }
  });

  // Handle terminal input
  socket.on('input', (data: string) => {
    pty.write(data);
  });

  // Handle terminal resize
  socket.on('resize', ({ cols, rows }: { cols: number; rows: number }) => {
    pty.resize(cols, rows);
  });

  // Cleanup on disconnect
  socket.on('disconnect', () => {
    console.log('Terminal client disconnected');
    pty.kill();
  });
});

function getTailViewerHTML(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terminal Tail - Cumulative Log</title>
  <style>
    @font-face {
      font-family: 'Cascadia Code';
      src: url('/fonts/cascadia-code-latin-400-normal.woff2') format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html, body {
      width: 100%;
      height: 100%;
      background-color: #1e1e1e;
      overflow: hidden;
      font-family: 'Cascadia Code', 'Courier New', monospace;
      color: #d4d4d4;
    }
    #container {
      width: 100%;
      height: 100%;
      padding: 20px;
      display: flex;
      flex-direction: column;
    }
    #status {
      padding: 10px;
      background: #2d2d2d;
      border-radius: 4px;
      margin-bottom: 10px;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    #status.connected {
      background: #0dbc79;
      color: #000;
    }
    #output {
      flex: 1;
      background: #1e1e1e;
      border: 1px solid #333;
      border-radius: 4px;
      padding: 10px;
      overflow-y: auto;
      white-space: pre-wrap;
      font-family: 'Cascadia Code', monospace;
      font-size: 13px;
      line-height: 1.5;
    }
    .log-line {
      margin: 0;
      padding: 2px 0;
    }
    .timestamp {
      color: #858585;
      margin-right: 8px;
    }
  </style>
</head>
<body>
  <div id="container">
    <div id="status">
      <span id="status-text">Connecting to tail stream...</span>
      <span id="line-count">Lines: 0</span>
    </div>
    <div id="output"></div>
  </div>

  <script>
    const statusEl = document.getElementById('status');
    const statusTextEl = document.getElementById('status-text');
    const lineCountEl = document.getElementById('line-count');
    const outputEl = document.getElementById('output');
    let totalLines = 0;

    // Connect to tail SSE endpoint
    const eventSource = new EventSource('/tail');

    eventSource.onopen = () => {
      statusTextEl.textContent = '✓ Connected to tail stream (append-only log)';
      statusEl.className = 'connected';
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'connected') {
        console.log('Tail connected at', new Date(data.timestamp));

        // Display full log history
        if (data.fullLog && data.fullLog.length > 0) {
          data.fullLog.forEach(line => {
            appendLine(line);
          });
          totalLines = data.fullLog.length;
          lineCountEl.textContent = 'Lines: ' + totalLines;
        }
      } else if (data.lines && Array.isArray(data.lines)) {
        // Append new lines
        data.lines.forEach(line => {
          appendLine(line);
          totalLines++;
        });
        lineCountEl.textContent = 'Lines: ' + totalLines;
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      statusTextEl.textContent = '✗ Connection lost. Reconnecting...';
      statusEl.className = '';
    };

    function appendLine(line) {
      const lineDiv = document.createElement('div');
      lineDiv.className = 'log-line';
      lineDiv.textContent = line;
      outputEl.appendChild(lineDiv);

      // Auto-scroll to bottom
      outputEl.scrollTop = outputEl.scrollHeight;
    }
  </script>
</body>
</html>
  `.trim();
}

function getStreamViewerHTML(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terminal Stream Viewer</title>
  <style>
    @font-face {
      font-family: 'Cascadia Code';
      src: url('/fonts/cascadia-code-latin-400-normal.woff2') format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html, body {
      width: 100%;
      height: 100%;
      background-color: #1e1e1e;
      overflow: hidden;
      font-family: 'Cascadia Code', 'Courier New', monospace;
      color: #d4d4d4;
    }
    #container {
      width: 100%;
      height: 100%;
      padding: 20px;
      display: flex;
      flex-direction: column;
    }
    #status {
      padding: 10px;
      background: #2d2d2d;
      border-radius: 4px;
      margin-bottom: 10px;
      font-size: 12px;
    }
    #status.connected {
      background: #0dbc79;
      color: #000;
    }
    #output {
      flex: 1;
      background: #1e1e1e;
      border: 1px solid #333;
      border-radius: 4px;
      padding: 10px;
      overflow-y: auto;
      white-space: pre;
      font-family: 'Cascadia Code', monospace;
      font-size: 14px;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div id="container">
    <div id="status">Connecting to stream...</div>
    <div id="output"></div>
  </div>

  <script>
    const statusEl = document.getElementById('status');
    const outputEl = document.getElementById('output');

    // Connect to SSE endpoint
    const eventSource = new EventSource('/terminal/stream');

    eventSource.onopen = () => {
      statusEl.textContent = '✓ Connected to terminal stream';
      statusEl.className = 'connected';
    };

    eventSource.onmessage = (event) => {
      console.log('Received SSE message:', event.data);
      const data = JSON.parse(event.data);
      console.log('Parsed data:', data);

      if (data.type === 'connected') {
        console.log('Stream connected at', new Date(data.timestamp));
      } else if (data.content) {
        console.log('Updating output with content:', data.content);
        outputEl.textContent = data.content;
        // Auto-scroll to bottom
        outputEl.scrollTop = outputEl.scrollHeight;
      } else {
        console.log('No content in data, keys:', Object.keys(data));
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      statusEl.textContent = '✗ Connection lost. Reconnecting...';
      statusEl.className = '';
    };
  </script>
</body>
</html>
  `.trim();
}

function getTerminalHTML(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>fspec Web Terminal</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@xterm/xterm@5.5.0/css/xterm.css" />
  <style>
    @font-face {
      font-family: 'Cascadia Code';
      src: url('/fonts/cascadia-code-latin-400-normal.woff2') format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html, body {
      width: 100%;
      height: 100%;
      background-color: #1e1e1e;
      overflow: hidden;
      font-family: 'Cascadia Code', 'Courier New', monospace;
    }
    #terminal-container {
      width: 100%;
      height: 100%;
      background-color: #1e1e1e;
    }
    #terminal {
      width: 100%;
      height: 100%;
    }
    .xterm {
      width: 100% !important;
      height: 100% !important;
    }
    .xterm-screen {
      width: 100% !important;
      height: 100% !important;
    }
  </style>
</head>
<body>
  <div id="terminal-container">
    <div id="terminal"></div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/@xterm/xterm@5.5.0/lib/xterm.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@xterm/addon-fit@0.10.0/lib/addon-fit.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/socket.io-client@4.8.1/dist/socket.io.min.js"></script>
  <script>
    // Initialize xterm.js
    const term = new Terminal({
      cols: 120,
      rows: 30,
      fontFamily: 'Cascadia Code, monospace',
      fontSize: 16,
      fontWeight: 'normal',
      letterSpacing: 0,
      lineHeight: 1,
      convertEol: true,
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#ffffff',
        cursorAccent: '#1e1e1e',
        selection: 'rgba(255, 255, 255, 0.3)',
        black: '#000000',
        red: '#cd3131',
        green: '#0dbc79',
        yellow: '#e5e510',
        blue: '#2472c8',
        magenta: '#bc3fbc',
        cyan: '#11a8cd',
        white: '#e5e5e5',
        brightBlack: '#666666',
        brightRed: '#f14c4c',
        brightGreen: '#23d18b',
        brightYellow: '#f5f543',
        brightBlue: '#3b8eea',
        brightMagenta: '#d670d6',
        brightCyan: '#29b8db',
        brightWhite: '#ffffff',
      },
      allowProposedApi: true,
    });

    // Load fit addon for resizing
    const fitAddon = new FitAddon.FitAddon();
    term.loadAddon(fitAddon);

    // Open terminal
    term.open(document.getElementById('terminal'));
    fitAddon.fit();

    // Connect to socket.io server
    const socket = io();

    // Handle output from PTY
    socket.on('output', (data) => {
      term.write(data);
    });

    // Send input to PTY
    term.onData((data) => {
      socket.emit('input', data);
    });

    // Handle terminal resize
    window.addEventListener('resize', () => {
      fitAddon.fit();
      socket.emit('resize', { cols: term.cols, rows: term.rows });
    });

    // Track last sent line count for incremental tail updates
    let lastSentLineCount = 0;

    // Monitor terminal output using onWriteParsed (best practice from xterm.js analysis)
    term.onWriteParsed(() => {
      const buffer = term.buffer.active;

      // Get entire visible viewport using viewportY (correct API)
      const viewportLines = [];
      const viewportStart = buffer.viewportY;
      const viewportEnd = viewportStart + term.rows;

      for (let i = viewportStart; i < viewportEnd; i++) {
        const line = buffer.getLine(i);
        if (line) {
          const lineText = line.translateToString(true); // trimRight=true
          viewportLines.push(lineText);
        }
      }

      const terminalContent = viewportLines.join('\\n');

      // Send viewport snapshot to /terminal/output (for /stream endpoint)
      fetch('/terminal/output', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: terminalContent,
          timestamp: Date.now()
        })
      }).catch(err => {
        console.error('Failed to send terminal output:', err);
      });

      // Send incremental lines to /terminal/tail (for /tail endpoint)
      const totalLines = buffer.length;
      console.log('[TAIL] Buffer length:', totalLines, 'Last sent:', lastSentLineCount);

      if (totalLines > lastSentLineCount) {
        const newLines = [];
        for (let i = lastSentLineCount; i < totalLines; i++) {
          const line = buffer.getLine(i);
          if (line) {
            const lineText = line.translateToString(true);
            // Only send non-empty lines
            if (lineText.trim().length > 0) {
              console.log('[TAIL] New line', i, ':', lineText.substring(0, 50));
              newLines.push(lineText);
            }
          }
        }

        console.log('[TAIL] Sending', newLines.length, 'new lines');

        if (newLines.length > 0) {
          fetch('/terminal/tail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lines: newLines,
              timestamp: Date.now()
            })
          }).catch(err => {
            console.error('Failed to send tail updates:', err);
          });
        }

        lastSentLineCount = totalLines;
      }
    });

    console.log('Terminal initialized and connected to server');
  </script>
</body>
</html>
  `.trim();
}

// Start server
httpServer.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Server listening on ${url}`);

  // Auto-open browser
  open(url).catch(err => {
    console.error('Failed to open browser:', err);
    console.log(`Please open ${url} manually`);
  });
});
