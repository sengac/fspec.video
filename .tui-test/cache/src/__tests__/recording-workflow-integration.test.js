//# hash=b9c49970d7d046d7432317b15cfe568d
//# sourceMappingURL=recording-workflow-integration.test.js.map

/**
 * Feature: spec/features/add-comprehensive-integration-tests-for-recording-workflow.feature
 *
 * Integration tests for complete recording workflow
 */ function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
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
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
// Mock the recorder module before any imports
vi.mock('../recorder.js', function() {
    return {
        startRecording: vi.fn().mockResolvedValue(undefined)
    };
});
import { startRecording } from '../recorder.js';
import { recordAction } from '../index.js';
describe('Feature: Recording workflow integration', function() {
    var testDir = join(process.cwd(), '.test-integration');
    var configPath = join(testDir, 'fspec-videos.config.json');
    var scriptPath = join(process.cwd(), 'src', 'demos', 'basic-usage.ts');
    beforeEach(function() {
        if (!existsSync(testDir)) {
            mkdirSync(testDir, {
                recursive: true
            });
        }
        vi.clearAllMocks();
    });
    afterEach(function() {
        if (existsSync(testDir)) {
            rmSync(testDir, {
                recursive: true,
                force: true
            });
        }
    });
    describe('Scenario: Integration test with valid config file', function() {
        it('should pass merged config options to recorder', function() {
            return _async_to_generator(function() {
                var config, options;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            // @step Given I have a config file with width 100 and height 40
                            config = {
                                width: 100,
                                height: 40
                            };
                            writeFileSync(configPath, JSON.stringify(config, null, 2));
                            // @step When I run the record command
                            options = {
                                script: scriptPath,
                                output: join(testDir, 'output.webm'),
                                headless: true
                            };
                            return [
                                4,
                                recordAction(options, testDir)
                            ];
                        case 1:
                            _state.sent();
                            // @step Then the recorder module should be called with width 100 and height 40
                            expect(startRecording).toHaveBeenCalledWith(expect.objectContaining({
                                width: 100,
                                height: 40
                            }));
                            return [
                                2
                            ];
                    }
                });
            })();
        });
    });
    describe('Scenario: Integration test with CLI override', function() {
        it('should prioritize CLI options over config file', function() {
            return _async_to_generator(function() {
                var config, options;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            // @step Given I have a config file with width 100
                            config = {
                                width: 100
                            };
                            writeFileSync(configPath, JSON.stringify(config, null, 2));
                            // @step When I run the record command with --width 120
                            options = {
                                script: scriptPath,
                                output: join(testDir, 'output.webm'),
                                width: '120',
                                headless: true
                            };
                            return [
                                4,
                                recordAction(options, testDir)
                            ];
                        case 1:
                            _state.sent();
                            // @step Then the recorder module should be called with width 120 from CLI
                            expect(startRecording).toHaveBeenCalledWith(expect.objectContaining({
                                width: 120
                            }));
                            return [
                                2
                            ];
                    }
                });
            // @step And the config file width should be ignored
            // (Verified by the width being 120, not 100)
            })();
        });
    });
    describe('Scenario: Integration test with invalid config value', function() {
        it('should fail validation before calling recorder', function() {
            return _async_to_generator(function() {
                var config, options;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            // @step Given I have a config file with width 500
                            config = {
                                width: 500
                            };
                            writeFileSync(configPath, JSON.stringify(config, null, 2));
                            // @step When I run the record command
                            options = {
                                script: scriptPath,
                                output: join(testDir, 'output.webm'),
                                headless: true
                            };
                            // @step Then validation should fail before recorder is called
                            return [
                                4,
                                expect(recordAction(options, testDir)).rejects.toThrow()
                            ];
                        case 1:
                            _state.sent();
                            expect(startRecording).not.toHaveBeenCalled();
                            // @step And an error message should indicate width exceeds maximum
                            return [
                                4,
                                expect(recordAction(options, testDir)).rejects.toThrow(/Width must be between 1 and 300/)
                            ];
                        case 2:
                            _state.sent();
                            return [
                                2
                            ];
                    }
                });
            })();
        });
    });
    describe('Scenario: Integration test without config file', function() {
        it('should use default values when no config exists', function() {
            return _async_to_generator(function() {
                var options;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            // @step Given no config file exists in the project root
                            // (No config file created in this test)
                            // @step When I run the record command without options
                            options = {
                                script: scriptPath,
                                output: join(testDir, 'output.webm'),
                                headless: true
                            };
                            return [
                                4,
                                recordAction(options, testDir)
                            ];
                        case 1:
                            _state.sent();
                            // @step Then the recorder module should be called with default values
                            // @step And width should be 120
                            // @step And height should be 30
                            // @step And fps should be 30
                            expect(startRecording).toHaveBeenCalledWith(expect.objectContaining({
                                width: 120,
                                height: 30,
                                fps: 30
                            }));
                            return [
                                2
                            ];
                    }
                });
            })();
        });
    });
    describe('Scenario: Integration test with invalid JSON in config', function() {
        it('should show parse error with config file path', function() {
            return _async_to_generator(function() {
                var options;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            // @step Given I have a config file with invalid JSON syntax
                            writeFileSync(configPath, '{ invalid json }');
                            // @step When I run the record command
                            options = {
                                script: scriptPath,
                                output: join(testDir, 'output.webm'),
                                headless: true
                            };
                            // @step Then a parse error should be shown
                            return [
                                4,
                                expect(recordAction(options, testDir)).rejects.toThrow()
                            ];
                        case 1:
                            _state.sent();
                            // @step And the error message should include the config file path
                            return [
                                4,
                                expect(recordAction(options, testDir)).rejects.toThrow(/fspec-videos\.config\.json/)
                            ];
                        case 2:
                            _state.sent();
                            return [
                                2
                            ];
                    }
                });
            })();
        });
    });
});
