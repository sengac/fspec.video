//# hash=3bb4829236d4e9dd93ae05c305617ea7
//# sourceMappingURL=recorder.js.map

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
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
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
import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';
import { startServer } from './server.js';
export function startRecording(options) {
    return _async_to_generator(function() {
        var browser, serverCleanup, _ref, url, cleanup, page, recorder;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    browser = null;
                    serverCleanup = null;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        ,
                        14,
                        19
                    ]);
                    // Ensure output directory exists
                    return [
                        4,
                        mkdir(dirname(options.outputPath), {
                            recursive: true
                        })
                    ];
                case 2:
                    _state.sent();
                    // Start the Express server
                    console.log('Starting web server...');
                    return [
                        4,
                        startServer()
                    ];
                case 3:
                    _ref = _state.sent(), url = _ref.url, cleanup = _ref.cleanup;
                    serverCleanup = cleanup;
                    // Launch Puppeteer browser
                    console.log('Launching browser...');
                    return [
                        4,
                        puppeteer.launch({
                            headless: options.headless,
                            args: [
                                '--no-sandbox',
                                '--disable-setuid-sandbox',
                                '--disable-dev-shm-usage',
                                '--disable-web-security',
                                '--allow-file-access-from-files'
                            ],
                            defaultViewport: {
                                // 4K resolution for high quality recording
                                width: 3840,
                                height: 2160
                            }
                        })
                    ];
                case 4:
                    browser = _state.sent();
                    return [
                        4,
                        browser.newPage()
                    ];
                case 5:
                    page = _state.sent();
                    // Listen to browser console for debugging
                    page.on('console', function(msg) {
                        var type = msg.type();
                        var text = msg.text();
                        if (type === 'error') {
                            console.error("\uD83C\uDF10 Browser console.error: ".concat(text));
                        } else {
                            console.log("\uD83C\uDF10 Browser console.".concat(type, ": ").concat(text));
                        }
                    });
                    // Navigate to the terminal page
                    console.log('Loading terminal interface...');
                    return [
                        4,
                        page.goto(url, {
                            waitUntil: 'networkidle0'
                        })
                    ];
                case 6:
                    _state.sent();
                    // Wait for terminal to be ready
                    return [
                        4,
                        page.waitForSelector('#terminal', {
                            timeout: 10000
                        })
                    ];
                case 7:
                    _state.sent();
                    // Wait for canvas element to be created by xterm.js
                    return [
                        4,
                        page.waitForSelector('canvas', {
                            timeout: 10000
                        })
                    ];
                case 8:
                    _state.sent();
                    // Wait a bit more to ensure xterm has done its initial render
                    return [
                        4,
                        new Promise(function(resolve) {
                            return setTimeout(resolve, 500);
                        })
                    ];
                case 9:
                    _state.sent();
                    // Start recording using Puppeteer's built-in screencast
                    console.log('Starting video capture...');
                    return [
                        4,
                        page.screencast({
                            path: options.outputPath,
                            ffmpegPath: 'ffmpeg'
                        })
                    ];
                case 10:
                    recorder = _state.sent();
                    // Run the demo script
                    console.log('Executing demo script...');
                    return [
                        4,
                        runDemoScript(page, options.scriptPath)
                    ];
                case 11:
                    _state.sent();
                    // Wait a bit to ensure last frames are captured
                    return [
                        4,
                        new Promise(function(resolve) {
                            return setTimeout(resolve, 500);
                        })
                    ];
                case 12:
                    _state.sent();
                    // Stop recording
                    console.log('Stopping video capture...');
                    return [
                        4,
                        recorder.stop()
                    ];
                case 13:
                    _state.sent();
                    return [
                        3,
                        19
                    ];
                case 14:
                    if (!browser) return [
                        3,
                        16
                    ];
                    return [
                        4,
                        browser.close()
                    ];
                case 15:
                    _state.sent();
                    _state.label = 16;
                case 16:
                    if (!serverCleanup) return [
                        3,
                        18
                    ];
                    return [
                        4,
                        serverCleanup()
                    ];
                case 17:
                    _state.sent();
                    _state.label = 18;
                case 18:
                    return [
                        7
                    ];
                case 19:
                    return [
                        2
                    ];
            }
        });
    })();
}
function runDemoScript(page, scriptPath) {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            // Spawn the demo script as a separate process
            // Capture stdout and send to browser terminal via window.writeToTerminal()
            return [
                2,
                new Promise(function(resolve, reject) {
                    var child = spawn('npx', [
                        'tsx',
                        scriptPath
                    ], {
                        env: _object_spread_props(_object_spread({}, process.env), {
                            FSPEC_DEMO_MODE: 'true'
                        })
                    });
                    // Capture stdout and send each chunk to browser terminal
                    child.stdout.on('data', function(data) {
                        return _async_to_generator(function() {
                            var text, error;
                            return _ts_generator(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        text = data.toString();
                                        console.log('📝 Captured stdout:', JSON.stringify(text));
                                        _state.label = 1;
                                    case 1:
                                        _state.trys.push([
                                            1,
                                            3,
                                            ,
                                            4
                                        ]);
                                        return [
                                            4,
                                            page.evaluate(function(t) {
                                                console.log('🌐 Browser received:', JSON.stringify(t));
                                                // @ts-expect-error - window.writeToTerminal is exposed by server.ts
                                                if (typeof window.writeToTerminal === 'function') {
                                                    // @ts-expect-error - window.writeToTerminal is exposed by server.ts
                                                    window.writeToTerminal(t);
                                                    console.log('✅ Written to terminal');
                                                } else {
                                                    console.error('❌ window.writeToTerminal is not a function:', _type_of(window.writeToTerminal));
                                                }
                                            }, text)
                                        ];
                                    case 2:
                                        _state.sent();
                                        return [
                                            3,
                                            4
                                        ];
                                    case 3:
                                        error = _state.sent();
                                        console.error('❌ Error sending to browser:', error);
                                        return [
                                            3,
                                            4
                                        ];
                                    case 4:
                                        return [
                                            2
                                        ];
                                }
                            });
                        })();
                    });
                    // Also capture stderr for debugging
                    child.stderr.on('data', function(data) {
                        return _async_to_generator(function() {
                            var text;
                            return _ts_generator(this, function(_state) {
                                text = data.toString();
                                console.error('Demo script stderr:', text);
                                return [
                                    2
                                ];
                            });
                        })();
                    });
                    child.on('close', function(code) {
                        if (code === 0) {
                            resolve();
                        } else {
                            reject(new Error("Demo script exited with code ".concat(code)));
                        }
                    });
                    child.on('error', reject);
                })
            ];
        });
    })();
}
