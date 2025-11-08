//# hash=e5f716e8ed65d789de7d0a71a48c03c1
//# sourceMappingURL=documentation.test.js.map

/**
 * Feature: spec/features/document-recording-workflow-and-add-example-videos-to-repository.feature
 *
 * Tests for documentation completeness
 */ import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
describe('Feature: Documentation', function() {
    var readmePath = join(process.cwd(), 'README.md');
    describe('Scenario: README includes installation instructions', function() {
        it('should have Installation section with npm install', function() {
            // @step Given I want to install and use fspec-videos
            // (User needs to know how to install)
            // @step When I read the README.md file
            expect(existsSync(readmePath)).toBe(true);
            var readme = readFileSync(readmePath, 'utf-8');
            // @step Then I should see an Installation section
            expect(readme).toMatch(/##\s+Installation/i);
            // @step And the section should include npm install command
            expect(readme).toContain('npm install');
        });
    });
    describe('Scenario: README documents CLI commands with examples', function() {
        it('should document record and list commands with examples', function() {
            // @step Given I want to record a demo video
            // (User needs to know how to use the tool)
            // @step When I read the README.md file
            expect(existsSync(readmePath)).toBe(true);
            var readme = readFileSync(readmePath, 'utf-8');
            // @step Then I should see examples of the record command
            expect(readme).toMatch(/record/i);
            // @step And I should see the example: fspec-videos record -s src/demos/basic-usage.ts
            expect(readme).toContain('fspec-videos record -s src/demos/basic-usage.ts');
            // @step And I should see documentation for the list command
            expect(readme).toMatch(/list/i);
        });
    });
    describe('Scenario: README documents configuration file format', function() {
        it('should document config file with examples', function() {
            // @step Given I want to use a configuration file
            // (User wants to configure defaults)
            // @step When I read the README.md file
            expect(existsSync(readmePath)).toBe(true);
            var readme = readFileSync(readmePath, 'utf-8');
            // @step Then I should see a Configuration section
            expect(readme).toMatch(/##\s+Configuration/i);
            // @step And I should see an example config file with width, height, and fps options
            expect(readme).toContain('width');
            expect(readme).toContain('height');
            expect(readme).toContain('fps');
            // @step And I should see an explanation of how CLI options override config values
            expect(readme).toMatch(/CLI.*override/i);
        });
    });
});
