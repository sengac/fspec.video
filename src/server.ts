import express, { Express } from 'express';
import { Server } from 'http';
import { AddressInfo } from 'net';

export interface ServerInfo {
  url: string;
  cleanup: () => Promise<void>;
}

export async function startServer(): Promise<ServerInfo> {
  const app: Express = express();

  // Serve the terminal HTML page
  app.get('/', (_req, res) => {
    res.send(getTerminalHTML());
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
      font-family: 'Courier New', monospace;
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
  <script src="https://cdn.jsdelivr.net/npm/@xterm/addon-canvas@0.7.0/lib/addon-canvas.js"></script>
  <script>
    // Initialize xterm.js
    const term = new Terminal({
      cols: 120,
      rows: 30,
      fontSize: 96,
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
