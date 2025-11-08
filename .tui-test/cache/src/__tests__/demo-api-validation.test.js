//# hash=07c6729354b6b4af2c66cfb7f1ff08ff
//# sourceMappingURL=demo-api-validation.test.js.map

/**
 * Feature: spec/features/demo-scripts-use-incorrect-microsoft-tui-test-api.feature
 */ import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
describe('Feature: Demo scripts use correct microsoft/tui-test API', function() {
    describe('Scenario: Shell demo script uses correct tui-test API', function() {
        it('should have correct API usage', function() {
            // @step Given I create a demo script as demos/shell-commands.test.ts
            var demoPath = 'demos/shell-commands.test.ts';
            expect(existsSync(demoPath)).toBe(true);
            // @step When I import test, expect, and Shell from microsoft/tui-test
            var content = readFileSync(demoPath, 'utf-8');
            expect(content).toContain("import { test, expect, Shell } from '@microsoft/tui-test'");
            // @step And I use test.use({ shell: Shell.Bash }) to configure the shell
            expect(content).toContain('test.use({ shell: Shell.Bash })');
            // @step And I write test('demo', async ({ terminal }) => {...}) with terminal fixture
            expect(content).toContain("test('demonstrate shell commands', async ({ terminal }) =>");
            // @step And I use terminal.submit('ls') to execute commands
            expect(content).toContain("terminal.submit(");
            // @step And I use await expect(terminal.getByText(...)).toBeVisible() for assertions
            expect(content).toContain('await expect(terminal.getByText');
            expect(content).toContain('.toBeVisible(');
            // @step Then the demo script uses correct tui-test API
            expect(content).toMatch(/test\([^)]+async\s*\(\s*{\s*terminal\s*}\s*\)\s*=>/);
            // @step And the script can be run with tui-test CLI
            expect(demoPath.endsWith('.test.ts')).toBe(true);
        });
    });
    describe('Scenario: fspec TUI demo script uses correct API', function() {
        it('should control TUI correctly', function() {
            // @step Given I create a demo script as demos/fspec-navigation.test.ts
            var demoPath = 'demos/fspec-navigation.test.ts';
            expect(existsSync(demoPath)).toBe(true);
            // @step When I use test.use({ program: { file: 'node', args: ['fspec/dist/index.js'] } })
            var content = readFileSync(demoPath, 'utf-8');
            expect(content).toContain('test.use({');
            expect(content).toContain('program:');
            // @step And I write test('demo', async ({ terminal }) => {...}) with terminal fixture
            expect(content).toContain("test('demonstrate fspec TUI navigation', async ({ terminal }) =>");
            // @step And I use terminal.keyDown() for navigation
            expect(content).toContain('terminal.keyDown()');
            // @step And I use terminal.write() for key presses
            expect(content).toContain("terminal.write(");
            // @step And I use await expect(terminal.getByText('fspec')).toBeVisible()
            expect(content).toContain("await expect(terminal.getByText('fspec'");
            // @step Then the demo script controls the TUI correctly
            expect(content).toMatch(/terminal\.key/);
            // @step And the script uses terminal fixture methods
            expect(content).toContain('terminal.');
        });
    });
});
