//# hash=0143e277a136027e71ce58041131d6b2
//# sourceMappingURL=server.js.map

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _ts_generator(thisArg, body) {
    var f, y, t, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
import express from 'express';
export function startServer() {
    return _async_to_generator(function() {
        var app, server, address, url, cleanup;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    app = express();
                    // Serve the terminal HTML page
                    app.get('/', function(_req, res) {
                        res.send(getTerminalHTML());
                    });
                    return [
                        4,
                        new Promise(function(resolve, reject) {
                            var s = app.listen(0, function() {
                                return resolve(s);
                            });
                            s.on('error', reject);
                        })
                    ];
                case 1:
                    server = _state.sent();
                    address = server.address();
                    url = "http://localhost:".concat(address.port);
                    cleanup = function() {
                        return _async_to_generator(function() {
                            return _ts_generator(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        return [
                                            4,
                                            new Promise(function(resolve, reject) {
                                                server.close(function(err) {
                                                    if (err) reject(err);
                                                    else resolve();
                                                });
                                            })
                                        ];
                                    case 1:
                                        _state.sent();
                                        return [
                                            2
                                        ];
                                }
                            });
                        })();
                    };
                    return [
                        2,
                        {
                            url: url,
                            cleanup: cleanup
                        }
                    ];
            }
        });
    })();
}
function getTerminalHTML() {
    return "\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>fspec Terminal Recording</title>\n  <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/@xterm/xterm@5.5.0/css/xterm.css\" />\n  <style>\n    body {\n      margin: 0;\n      padding: 20px;\n      background-color: #1e1e1e;\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      min-height: 100vh;\n      font-family: 'Courier New', monospace;\n    }\n    #terminal-container {\n      background-color: #1e1e1e;\n      padding: 10px;\n      border-radius: 8px;\n      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);\n    }\n    #terminal {\n      width: 100%;\n      height: 100%;\n    }\n    canvas {\n      image-rendering: pixelated;\n    }\n  </style>\n</head>\n<body>\n  <div id=\"terminal-container\">\n    <div id=\"terminal\"></div>\n  </div>\n\n  <script src=\"https://cdn.jsdelivr.net/npm/@xterm/xterm@5.5.0/lib/xterm.js\"></script>\n  <script src=\"https://cdn.jsdelivr.net/npm/@xterm/addon-fit@0.10.0/lib/addon-fit.js\"></script>\n  <script src=\"https://cdn.jsdelivr.net/npm/@xterm/addon-webgl@0.18.0/lib/addon-webgl.js\"></script>\n  <script>\n    // Initialize xterm.js\n    const term = new Terminal({\n      cols: 120,\n      rows: 30,\n      fontSize: 14,\n      fontFamily: '\"Cascadia Code\", \"Fira Code\", \"Courier New\", monospace',\n      theme: {\n        background: '#1e1e1e',\n        foreground: '#d4d4d4',\n        cursor: '#ffffff',\n        cursorAccent: '#1e1e1e',\n        selection: 'rgba(255, 255, 255, 0.3)',\n        black: '#000000',\n        red: '#cd3131',\n        green: '#0dbc79',\n        yellow: '#e5e510',\n        blue: '#2472c8',\n        magenta: '#bc3fbc',\n        cyan: '#11a8cd',\n        white: '#e5e5e5',\n        brightBlack: '#666666',\n        brightRed: '#f14c4c',\n        brightGreen: '#23d18b',\n        brightYellow: '#f5f543',\n        brightBlue: '#3b8eea',\n        brightMagenta: '#d670d6',\n        brightCyan: '#29b8db',\n        brightWhite: '#ffffff',\n      },\n      allowProposedApi: true,\n    });\n\n    // Load addons\n    const fitAddon = new FitAddon.FitAddon();\n    term.loadAddon(fitAddon);\n\n    // Try to use WebGL for better performance\n    try {\n      const webglAddon = new WebglAddon.WebglAddon();\n      term.loadAddon(webglAddon);\n    } catch (e) {\n      console.warn('WebGL addon failed to load, using canvas renderer', e);\n    }\n\n    // Open terminal\n    term.open(document.getElementById('terminal'));\n    fitAddon.fit();\n\n    // Expose terminal to the page for interaction\n    window.term = term;\n\n    // Write initial prompt\n    term.write('$ ');\n\n    // Handle terminal input\n    term.onData(data => {\n      // Echo input back to terminal\n      term.write(data);\n\n      // Handle special keys\n      if (data.charCodeAt(0) === 13) { // Enter key\n        term.write('\\r\\n$ ');\n      } else if (data.charCodeAt(0) === 127) { // Backspace\n        term.write('\\b \\b');\n      }\n    });\n\n    // Expose functions for demo script interaction\n    window.writeToTerminal = (text) => {\n      term.write(text);\n    };\n\n    window.clearTerminal = () => {\n      term.clear();\n    };\n\n    console.log('Terminal initialized and ready for recording');\n  </script>\n</body>\n</html>\n  ".trim();
}
