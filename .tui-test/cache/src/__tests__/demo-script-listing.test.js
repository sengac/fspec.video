//# hash=c716210a86cea8ba35aeae8b5052427e
//# sourceMappingURL=demo-script-listing.test.js.map

/**
 * Feature: spec/features/demo-script-listing.feature
 *
 * Tests for demo script listing functionality
 */ import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
describe('Feature: Demo script listing', function() {
    describe('Scenario: List all available demo scripts', function() {
        it('should list all three demo scripts', function() {
            // @step Given the src/demos directory contains three TypeScript demo files
            // (src/demos directory already has 3 .ts files)
            // @step When I run the list command
            var output = execSync('./dist/index.js list', {
                encoding: 'utf-8'
            });
            // @step Then I should see all three demo scripts displayed
            // @step And the scripts should include basic-usage.ts
            expect(output).toContain('basic-usage.ts');
            // @step And the scripts should include kanban-workflow.ts
            expect(output).toContain('kanban-workflow.ts');
            // @step And the scripts should include spec-review.ts
            expect(output).toContain('spec-review.ts');
        });
    });
    describe('Scenario: Demo scripts displayed in alphabetical order', function() {
        it('should display scripts in alphabetical order', function() {
            // @step Given the src/demos directory contains multiple demo files
            // (src/demos directory already has multiple .ts files)
            // @step When I run the list command
            var output = execSync('./dist/index.js list', {
                encoding: 'utf-8'
            });
            // @step Then the demo scripts should be listed in alphabetical order
            var basicIndex = output.indexOf('basic-usage.ts');
            var kanbanIndex = output.indexOf('kanban-workflow.ts');
            var specIndex = output.indexOf('spec-review.ts');
            expect(basicIndex).toBeLessThan(kanbanIndex);
            expect(kanbanIndex).toBeLessThan(specIndex);
        });
    });
    describe('Scenario: Each script shows full relative path', function() {
        it('should display full path for each script', function() {
            // @step Given the src/demos directory contains demo files
            // (src/demos directory already has demo files)
            // @step When I run the list command
            var output = execSync('./dist/index.js list', {
                encoding: 'utf-8'
            });
            // @step Then each script should display its path as "src/demos/<filename>.ts"
            expect(output).toContain('src/demos/basic-usage.ts');
            expect(output).toContain('src/demos/kanban-workflow.ts');
            expect(output).toContain('src/demos/spec-review.ts');
        });
    });
    describe('Scenario: Display usage instructions', function() {
        it('should show usage instructions with example command', function() {
            // @step Given I want to know how to use a demo script
            // (User needs guidance on how to use the listed scripts)
            // @step When I run the list command
            var output = execSync('./dist/index.js list', {
                encoding: 'utf-8'
            });
            // @step Then the output should include usage instructions
            expect(output).toMatch(/Run with:/i);
            // @step And the instructions should show an example record command
            expect(output).toContain('fspec-videos record -s');
        });
    });
});
