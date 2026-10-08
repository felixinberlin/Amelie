import { AmelieHealth } from './types.js';

export function renderHealthJson(health: AmelieHealth): string {
  // Return clean, formatted, sorted JSON string
  return JSON.stringify(health, null, 2) + '\n';
}
