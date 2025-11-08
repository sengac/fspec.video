/**
 * Utility functions for fspec video recording
 */

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export interface DemoScript {
  name: string;
  description: string;
  path: string;
}

export const AVAILABLE_DEMOS: DemoScript[] = [
  {
    name: 'basic-usage',
    description: 'Basic fspec TUI navigation and commands',
    path: 'src/demos/basic-usage.ts',
  },
  {
    name: 'kanban-workflow',
    description: 'Moving work units through Kanban states',
    path: 'src/demos/kanban-workflow.ts',
  },
  {
    name: 'spec-review',
    description: 'Reviewing feature specifications and acceptance criteria',
    path: 'src/demos/spec-review.ts',
  },
];

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
}

export function getDefaultOutputPath(scriptName: string): string {
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  return `recordings/${scriptName}-${timestamp}.webm`;
}
