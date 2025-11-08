//# hash=dc2ecf0baddfea09908a8671b3fd6ef6
//# sourceMappingURL=utils.js.map

/**
 * Utility functions for fspec video recording
 */ export function delay(ms) {
    return new Promise(function(resolve) {
        return setTimeout(resolve, ms);
    });
}
export var AVAILABLE_DEMOS = [
    {
        name: 'basic-usage',
        description: 'Basic fspec TUI navigation and commands',
        path: 'src/demos/basic-usage.ts'
    },
    {
        name: 'kanban-workflow',
        description: 'Moving work units through Kanban states',
        path: 'src/demos/kanban-workflow.ts'
    },
    {
        name: 'spec-review',
        description: 'Reviewing feature specifications and acceptance criteria',
        path: 'src/demos/spec-review.ts'
    }
];
export function formatDuration(ms) {
    var seconds = Math.floor(ms / 1000);
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    if (minutes > 0) {
        return "".concat(minutes, "m ").concat(remainingSeconds, "s");
    }
    return "".concat(seconds, "s");
}
export function getDefaultOutputPath(scriptName) {
    var timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    return "recordings/".concat(scriptName, "-").concat(timestamp, ".webm");
}
