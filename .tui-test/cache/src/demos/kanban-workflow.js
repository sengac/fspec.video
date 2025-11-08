//# hash=612685a2647ced39fa55b639a4d84e1e
//# sourceMappingURL=kanban-workflow.js.map

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
import { TestController } from '@microsoft/tui-test';
import { homedir } from 'os';
import { join } from 'path';
/**
 * Kanban workflow demo for fspec TUI
 * Demonstrates moving work units through different states
 */ export function kanbanWorkflowDemo() {
    return _async_to_generator(function() {
        var fspecPath, controller, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    fspecPath = join(homedir(), 'projects', 'fspec', 'dist', 'index.js');
                    controller = new TestController();
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        21,
                        22,
                        24
                    ]);
                    console.log('Starting fspec TUI for Kanban workflow demo...');
                    return [
                        4,
                        controller.spawn(process.execPath, [
                            fspecPath
                        ], {
                            cwd: join(homedir(), 'projects', 'fspec'),
                            env: _object_spread_props(_object_spread({}, process.env), {
                                FORCE_COLOR: '1'
                            })
                        })
                    ];
                case 2:
                    _state.sent();
                    return [
                        4,
                        controller.waitForText('fspec', {
                            timeout: 5000
                        })
                    ];
                case 3:
                    _state.sent();
                    return [
                        4,
                        delay(1500)
                    ];
                case 4:
                    _state.sent();
                    // Demo: Show Kanban board
                    console.log('Demo: Opening Kanban board...');
                    return [
                        4,
                        controller.write('k')
                    ];
                case 5:
                    _state.sent(); // Open Kanban view (if available)
                    return [
                        4,
                        delay(2000)
                    ];
                case 6:
                    _state.sent();
                    // Demo: Select a work unit
                    console.log('Demo: Selecting work unit...');
                    return [
                        4,
                        controller.write('j')
                    ];
                case 7:
                    _state.sent(); // Move down
                    return [
                        4,
                        delay(500)
                    ];
                case 8:
                    _state.sent();
                    return [
                        4,
                        controller.write('\r')
                    ];
                case 9:
                    _state.sent(); // Select
                    return [
                        4,
                        delay(1000)
                    ];
                case 10:
                    _state.sent();
                    // Demo: Move to In Progress
                    console.log('Demo: Moving to In Progress...');
                    return [
                        4,
                        controller.write('i')
                    ];
                case 11:
                    _state.sent(); // Move to In Progress (example command)
                    return [
                        4,
                        delay(2000)
                    ];
                case 12:
                    _state.sent();
                    // Demo: View details
                    console.log('Demo: Viewing details...');
                    return [
                        4,
                        controller.write('\r')
                    ];
                case 13:
                    _state.sent(); // Open details
                    return [
                        4,
                        delay(2000)
                    ];
                case 14:
                    _state.sent();
                    // Demo: Move to Testing
                    console.log('Demo: Moving to Testing...');
                    return [
                        4,
                        controller.write('t')
                    ];
                case 15:
                    _state.sent(); // Move to Testing
                    return [
                        4,
                        delay(2000)
                    ];
                case 16:
                    _state.sent();
                    // Demo: Complete the work unit
                    console.log('Demo: Completing work unit...');
                    return [
                        4,
                        controller.write('c')
                    ];
                case 17:
                    _state.sent(); // Complete
                    return [
                        4,
                        delay(2000)
                    ];
                case 18:
                    _state.sent();
                    // Exit
                    console.log('Demo: Exiting...');
                    return [
                        4,
                        controller.write('q')
                    ];
                case 19:
                    _state.sent();
                    return [
                        4,
                        delay(1000)
                    ];
                case 20:
                    _state.sent();
                    console.log('Kanban workflow demo completed!');
                    return [
                        3,
                        24
                    ];
                case 21:
                    error = _state.sent();
                    console.error('Demo failed:', error);
                    throw error;
                case 22:
                    return [
                        4,
                        controller.close()
                    ];
                case 23:
                    _state.sent();
                    return [
                        7
                    ];
                case 24:
                    return [
                        2
                    ];
            }
        });
    })();
}
function delay(ms) {
    return new Promise(function(resolve) {
        return setTimeout(resolve, ms);
    });
}
if (import.meta.url === "file://".concat(process.argv[1])) {
    kanbanWorkflowDemo().catch(function(error) {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}
