//# hash=8642db4e9c6e3398b805869602e32646
//# sourceMappingURL=recording-option-validation.test.js.map

/**
 * Feature: spec/features/recording-option-validation.feature
 *
 * Tests for recording option validation
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
import { describe, it, expect } from 'vitest';
import { validateRecordingOptions } from '../validator.js';
describe('Feature: Recording option validation', function() {
    describe('Scenario: Reject negative terminal width', function() {
        it('should reject negative width with clear error message', function() {
            return _async_to_generator(function() {
                var options;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            // @step Given I want to record a demo video
                            options = {
                                scriptPath: 'test-script.ts',
                                outputPath: 'test.webm',
                                height: 30,
                                fps: 30,
                                headless: true
                            };
                            // @step When I run the record command with width set to -1
                            options.width = -1;
                            // @step Then the command should fail with error "Width must be greater than 0"
                            return [
                                4,
                                expect(validateRecordingOptions(options)).rejects.toThrow('Width must be greater than 0')
                            ];
                        case 1:
                            _state.sent();
                            return [
                                2
                            ];
                    }
                });
            // @step And no recording should be started
            // (validation prevents recording from starting)
            })();
        });
    });
    describe('Scenario: Reject zero terminal height', function() {
        it('should reject zero height with clear error message', function() {
            return _async_to_generator(function() {
                var options;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            // @step Given I want to record a demo video
                            options = {
                                scriptPath: 'test-script.ts',
                                outputPath: 'test.webm',
                                width: 120,
                                fps: 30,
                                headless: true
                            };
                            // @step When I run the record command with height set to 0
                            options.height = 0;
                            // @step Then the command should fail with error "Height must be greater than 0"
                            return [
                                4,
                                expect(validateRecordingOptions(options)).rejects.toThrow('Height must be greater than 0')
                            ];
                        case 1:
                            _state.sent();
                            return [
                                2
                            ];
                    }
                });
            // @step And no recording should be started
            // (validation prevents recording from starting)
            })();
        });
    });
    describe('Scenario: Reject FPS above maximum', function() {
        it('should reject FPS above 120 with clear error message', function() {
            return _async_to_generator(function() {
                var options;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            // @step Given I want to record a demo video
                            options = {
                                scriptPath: 'test-script.ts',
                                outputPath: 'test.webm',
                                width: 120,
                                height: 30,
                                headless: true
                            };
                            // @step When I run the record command with fps set to 200
                            options.fps = 200;
                            // @step Then the command should fail with error "FPS must be between 1 and 120"
                            return [
                                4,
                                expect(validateRecordingOptions(options)).rejects.toThrow('FPS must be between 1 and 120')
                            ];
                        case 1:
                            _state.sent();
                            return [
                                2
                            ];
                    }
                });
            // @step And no recording should be started
            // (validation prevents recording from starting)
            })();
        });
    });
    describe('Scenario: Reject non-existent script file', function() {
        it('should reject non-existent script with clear error message', function() {
            return _async_to_generator(function() {
                var options;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            // @step Given I want to record a demo video
                            options = {
                                scriptPath: 'non-existent-script.ts',
                                outputPath: 'test.webm',
                                width: 120,
                                height: 30,
                                fps: 30,
                                headless: true
                            };
                            // @step When I run the record command with a non-existent script path
                            // (options.scriptPath is already non-existent)
                            // @step Then the command should fail with error containing "Script file not found"
                            return [
                                4,
                                expect(validateRecordingOptions(options)).rejects.toThrow(/Script file not found/)
                            ];
                        case 1:
                            _state.sent();
                            return [
                                2
                            ];
                    }
                });
            // @step And no recording should be started
            // (validation prevents recording from starting)
            })();
        });
    });
    describe('Scenario: Accept valid recording options', function() {
        it('should accept valid options and allow recording to start', function() {
            return _async_to_generator(function() {
                var options;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            // @step Given I want to record a demo video
                            // @step And I have a valid demo script file
                            options = {
                                scriptPath: 'src/demos/basic-usage.ts',
                                outputPath: 'test.webm',
                                width: 120,
                                height: 30,
                                fps: 30,
                                headless: true
                            };
                            // @step When I run the record command with width 120, height 30, and fps 30
                            // (options already set with valid values)
                            // @step Then the validation should pass
                            return [
                                4,
                                expect(validateRecordingOptions(options)).resolves.toBeUndefined()
                            ];
                        case 1:
                            _state.sent();
                            return [
                                2
                            ];
                    }
                });
            // @step And the recording should start
            // (validation passing allows recording to proceed)
            })();
        });
    });
    describe('Scenario: Reject terminal width above maximum', function() {
        it('should reject width above 300 with clear error message', function() {
            return _async_to_generator(function() {
                var options;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            // @step Given I want to record a demo video
                            options = {
                                scriptPath: 'test-script.ts',
                                outputPath: 'test.webm',
                                height: 30,
                                fps: 30,
                                headless: true
                            };
                            // @step When I run the record command with width set to 400
                            options.width = 400;
                            // @step Then the command should fail with error "Width must be between 1 and 300"
                            return [
                                4,
                                expect(validateRecordingOptions(options)).rejects.toThrow('Width must be between 1 and 300')
                            ];
                        case 1:
                            _state.sent();
                            return [
                                2
                            ];
                    }
                });
            // @step And no recording should be started
            // (validation prevents recording from starting)
            })();
        });
    });
    describe('Scenario: Reject terminal height above maximum', function() {
        it('should reject height above 100 with clear error message', function() {
            return _async_to_generator(function() {
                var options;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            // @step Given I want to record a demo video
                            options = {
                                scriptPath: 'test-script.ts',
                                outputPath: 'test.webm',
                                width: 120,
                                fps: 30,
                                headless: true
                            };
                            // @step When I run the record command with height set to 150
                            options.height = 150;
                            // @step Then the command should fail with error "Height must be between 1 and 100"
                            return [
                                4,
                                expect(validateRecordingOptions(options)).rejects.toThrow('Height must be between 1 and 100')
                            ];
                        case 1:
                            _state.sent();
                            return [
                                2
                            ];
                    }
                });
            // @step And no recording should be started
            // (validation prevents recording from starting)
            })();
        });
    });
    describe('Scenario: Reject invalid output directory', function() {
        it('should reject unwritable output directory with clear error message', function() {
            return _async_to_generator(function() {
                var options;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            // @step Given I want to record a demo video
                            options = {
                                scriptPath: 'src/demos/basic-usage.ts',
                                outputPath: '/invalid/readonly/path.webm',
                                width: 120,
                                height: 30,
                                fps: 30,
                                headless: true
                            };
                            // @step When I run the record command with an unwritable output path
                            // (options.outputPath is already set to unwritable path)
                            // @step Then the command should fail with error containing "Output directory is not writable"
                            return [
                                4,
                                expect(validateRecordingOptions(options)).rejects.toThrow(/Output directory is not writable/)
                            ];
                        case 1:
                            _state.sent();
                            return [
                                2
                            ];
                    }
                });
            // @step And no recording should be started
            // (validation prevents recording from starting)
            })();
        });
    });
});
