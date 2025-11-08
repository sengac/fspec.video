//# hash=b9e457b6b6a7da455fd8d9ca7d6ac703
//# sourceMappingURL=index.js.map

#!/usr/bin/env node
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
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
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
import { Command } from 'commander';
import chalk from 'chalk';
import { resolve, join } from 'path';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { startRecording } from './recorder.js';
import { validateRecordingOptions } from './validator.js';
export function loadConfigFile() {
    var cwd = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : process.cwd();
    var configPath = join(cwd, 'fspec-videos.config.json');
    if (!existsSync(configPath)) {
        return {}; // No config file, use empty config
    }
    try {
        var configContent = readFileSync(configPath, 'utf-8');
        var config = JSON.parse(configContent);
        return config;
    } catch (error) {
        if (_instanceof(error, SyntaxError)) {
            throw new Error("Failed to parse fspec-videos.config.json: Invalid JSON syntax\nConfig file location: ".concat(configPath));
        }
        throw error;
    }
}
// Export for testing
export function recordAction(_0) {
    return _async_to_generator(function(options) {
        var cwd, config, _config_width, width, _config_height, height, _config_fps, fps, _options_output, _ref, outputPath, scriptPath, resolvedOutputPath, recordingOptions;
        var _arguments = arguments;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    cwd = _arguments.length > 1 && _arguments[1] !== void 0 ? _arguments[1] : process.cwd();
                    // Load config file
                    config = loadConfigFile(cwd);
                    console.log(chalk.blue('🎬 Starting fspec video recording...'));
                    console.log(chalk.gray("Script: ".concat(options.script)));
                    // Merge config with CLI options (CLI takes precedence)
                    // Use CLI option if provided, otherwise use config, otherwise use default
                    width = options.width ? parseInt(options.width) : (_config_width = config.width) !== null && _config_width !== void 0 ? _config_width : 120;
                    height = options.height ? parseInt(options.height) : (_config_height = config.height) !== null && _config_height !== void 0 ? _config_height : 30;
                    fps = options.fps ? parseInt(options.fps) : (_config_fps = config.fps) !== null && _config_fps !== void 0 ? _config_fps : 30;
                    outputPath = (_ref = (_options_output = options.output) !== null && _options_output !== void 0 ? _options_output : config.outputPath) !== null && _ref !== void 0 ? _ref : 'recordings/demo.webm';
                    console.log(chalk.gray("Output: ".concat(outputPath)));
                    console.log(chalk.gray("Terminal size: ".concat(width, "x").concat(height, " (").concat(fps, " FPS)")));
                    scriptPath = resolve(cwd, options.script);
                    resolvedOutputPath = resolve(cwd, outputPath);
                    recordingOptions = {
                        scriptPath: scriptPath,
                        outputPath: resolvedOutputPath,
                        width: width,
                        height: height,
                        fps: fps,
                        headless: options.headless
                    };
                    // Validate options before starting recording
                    return [
                        4,
                        validateRecordingOptions(recordingOptions)
                    ];
                case 1:
                    _state.sent();
                    return [
                        4,
                        startRecording(recordingOptions)
                    ];
                case 2:
                    _state.sent();
                    console.log(chalk.green('✅ Recording completed successfully!'));
                    console.log(chalk.gray("Saved to: ".concat(resolvedOutputPath)));
                    return [
                        2
                    ];
            }
        });
    }).apply(this, arguments);
}
var program = new Command();
program.name('fspec-videos').description('Demo video recorder for fspec TUI using @microsoft/tui-test').version('0.1.0');
program.command('record').description('Record a demo video from a script').requiredOption('-s, --script <path>', 'Path to the demo script file').option('-o, --output <path>', 'Output video file path').option('-w, --width <number>', 'Terminal width in columns').option('-h, --height <number>', 'Terminal height in rows').option('--fps <number>', 'Frames per second').option('--no-headless', 'Run browser in non-headless mode (for debugging)').action(function(options) {
    return _async_to_generator(function() {
        var error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        2,
                        ,
                        3
                    ]);
                    return [
                        4,
                        recordAction(options)
                    ];
                case 1:
                    _state.sent();
                    return [
                        3,
                        3
                    ];
                case 2:
                    error = _state.sent();
                    console.error(chalk.red('❌ Recording failed:'), error);
                    process.exit(1);
                    return [
                        3,
                        3
                    ];
                case 3:
                    return [
                        2
                    ];
            }
        });
    })();
});
program.command('list').description('List available demo scripts').action(function() {
    try {
        var demosDir = join(process.cwd(), 'src', 'demos');
        var files = readdirSync(demosDir);
        // Filter for TypeScript files and sort alphabetically
        var demoScripts = files.filter(function(file) {
            return file.endsWith('.ts');
        }).sort();
        console.log(chalk.blue('📋 Available demo scripts:'));
        demoScripts.forEach(function(script) {
            console.log(chalk.gray("  - src/demos/".concat(script)));
        });
        console.log(chalk.gray('\nRun with: fspec-videos record -s src/demos/<script-name>.ts'));
    } catch (error) {
        console.error(chalk.red('❌ Failed to list demo scripts:'), error);
        process.exit(1);
    }
});
// Only parse if running as main module (not imported in tests)
if (import.meta.url.startsWith('file:')) {
    var modulePath = new URL(import.meta.url).pathname;
    var scriptPath = process.argv[1];
    if (modulePath === scriptPath || modulePath.replace(/\.(js|ts)$/, '.js') === scriptPath) {
        program.parse(process.argv);
    }
}
