/**
 * Feature: spec/features/cascadia-code-font-integration.feature
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Feature: Cascadia Code Font Integration', () => {
  describe('Scenario: Install Cascadia Code font as project dependency', () => {
    it('should have Cascadia Code listed in package.json dependencies', () => {
      // @step Given I have a Node.js project with package.json
      const packageJsonPath = join(__dirname, '../../package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

      // @step When I install @fontsource/cascadia-code
      // (Installation already done via npm install)

      // @step Then package.json should list @fontsource/cascadia-code as a dependency
      expect(packageJson.dependencies).toHaveProperty('@fontsource/cascadia-code');

      // @step And the font files should be available in node_modules/@fontsource/cascadia-code
      const fontFilePath = join(__dirname, '../../node_modules/@fontsource/cascadia-code/files/cascadia-code-latin-400-normal.woff2');
      expect(() => readFileSync(fontFilePath)).not.toThrow();
    });
  });

  describe('Scenario: Configure Express server to serve font files', () => {
    it('should serve font files and include @font-face declarations', () => {
      // @step Given Cascadia Code is installed as a dependency
      const packageJsonPath = join(__dirname, '../../package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      expect(packageJson.dependencies).toHaveProperty('@fontsource/cascadia-code');

      // @step When the Express server starts
      const serverPath = join(__dirname, '../server.ts');
      const serverContent = readFileSync(serverPath, 'utf-8');

      // @step Then it should serve static font files from node_modules/@fontsource/cascadia-code
      expect(serverContent).toContain("express.static(join(__dirname, '../node_modules/@fontsource/cascadia-code/files'))");

      // @step And the terminal HTML page should include CSS @font-face declarations
      expect(serverContent).toContain('@font-face');
      expect(serverContent).toContain("font-family: 'Cascadia Code'");
      expect(serverContent).toContain("url('/fonts/cascadia-code-latin-400-normal.woff2')");
    });
  });

  describe('Scenario: Configure xterm.js to use Cascadia Code font', () => {
    it('should configure xterm.js with Cascadia Code as primary font', () => {
      // @step Given the terminal HTML includes Cascadia Code @font-face declarations
      const serverPath = join(__dirname, '../server.ts');
      const serverContent = readFileSync(serverPath, 'utf-8');
      expect(serverContent).toContain('@font-face');
      expect(serverContent).toContain("font-family: 'Cascadia Code'");

      // @step When xterm.js terminal is initialized
      // @step Then the fontFamily setting should have "Cascadia Code" as the first font
      expect(serverContent).toContain('fontFamily: \'"Cascadia Code"');

      // @step And the terminal should render text using Cascadia Code instead of fallback fonts
      // Verify fallback fonts are present
      expect(serverContent).toContain('"Cascadia Code", "Fira Code", "Courier New", monospace');
    });
  });
});
