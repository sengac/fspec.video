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

// Serve Cascadia Code font files from node_modules
app.use('/fonts', express.static(join(__dirname, '../node_modules/@fontsource/cascadia-code/files')));

// Serve the terminal HTML page
app.get('/', (_req, res) => {
  res.send(getTerminalHTML());
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
      fontSize: 16,
      fontFamily: '"Cascadia Code", "Fira Code", "Courier New", monospace',
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
