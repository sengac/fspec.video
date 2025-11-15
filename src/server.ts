import express, { Express } from 'express';
import { Server } from 'http';
import { AddressInfo } from 'net';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface ServerInfo {
  url: string;
  cleanup: () => Promise<void>;
}

export async function startServer(): Promise<ServerInfo> {
  const app: Express = express();

  // Middleware to parse JSON
  app.use(express.json());

  // Store SSE clients
  const streamClients: express.Response[] = [];

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

  // POST endpoint to receive terminal output from client
  app.post('/terminal/output', (req, res) => {
    const { content, timestamp } = req.body;

    // Broadcast to all SSE clients
    streamClients.forEach(client => {
      client.write(`data: ${JSON.stringify({ content, timestamp })}\n\n`);
    });

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

    // Remove client when connection closes
    req.on('close', () => {
      const index = streamClients.indexOf(res);
      if (index !== -1) {
        streamClients.splice(index, 1);
      }
    });
  });

  // Start the server
  const server: Server = await new Promise((resolve, reject) => {
    const s = app.listen(0, () => resolve(s));
    s.on('error', reject);
  });

  const address = server.address() as AddressInfo;
  const url = `http://localhost:${address.port}`;

  const cleanup = async () => {
    await new Promise<void>((resolve, reject) => {
      server.close(err => {
        if (err) reject(err);
        else resolve();
      });
    });
  };

  return { url, cleanup };
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
      const data = JSON.parse(event.data);

      if (data.type === 'connected') {
        console.log('Stream connected at', new Date(data.timestamp));
      } else if (data.content) {
        outputEl.textContent = data.content;
        // Auto-scroll to bottom
        outputEl.scrollTop = outputEl.scrollHeight;
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
  <title>fspec Terminal Recording</title>
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
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</head>
<body>
  <div id="terminal-container">
    <div id="terminal"></div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/@xterm/xterm@5.5.0/lib/xterm.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@xterm/addon-canvas@0.7.0/lib/addon-canvas.js"></script>
  <script>
    // Initialize xterm.js
    // Using 16px font size as requested
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

    // Use CanvasAddon for recording compatibility
    // NOTE: WebGL addon breaks canvas.captureStream() for MediaRecorder
    // CanvasAddon provides canvas rendering that works with video recording
    try {
      const canvasAddon = new CanvasAddon.CanvasAddon();
      term.loadAddon(canvasAddon);
      console.log('Canvas addon loaded successfully');
    } catch (e) {
      console.warn('Canvas addon failed to load, using DOM renderer', e);
    }

    // Open terminal
    term.open(document.getElementById('terminal'));
    // DO NOT use fitAddon.fit() - we want fixed dimensions for recording

    // Expose terminal to the page for interaction
    window.term = term;

    // Write initial prompt
    term.write('$ ');

    // Handle terminal input
    term.onData(data => {
      // Echo input back to terminal
      term.write(data);

      // Handle special keys
      if (data.charCodeAt(0) === 13) { // Enter key
        term.write('\\r\\n$ ');
      } else if (data.charCodeAt(0) === 127) { // Backspace
        term.write('\\b \\b');
      }
    });

    // Monitor terminal output using onWriteParsed (best practice from xterm.js analysis)
    term.onWriteParsed(() => {
      const buffer = term.buffer.active;

      // Get entire visible viewport
      const lines = [];
      const viewportStart = buffer.ydisp;
      const viewportEnd = viewportStart + term.rows;

      for (let i = viewportStart; i < viewportEnd; i++) {
        const line = buffer.lines.get(i);
        if (line) {
          lines.push(line.translateToString(true)); // trimRight=true
        }
      }

      const terminalContent = lines.join('\\n');

      // Send to server for streaming
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
    });

    // Expose functions for demo script interaction
    window.writeToTerminal = (text) => {
      term.write(text);
    };

    window.clearTerminal = () => {
      term.clear();
    };

    console.log('Terminal initialized and ready for recording');
  </script>
</body>
</html>
  `.trim();
}
