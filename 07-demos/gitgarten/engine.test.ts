import { describe, it, expect, vi, beforeEach } from 'vitest';

// Conceptual GitOperations class to be tested
class MockGitOperations {
  private files: Map<string, string> = new Map();
  private history: { docPath: string, content: string, message: string }[] = [];

  constructor(private repoPath: string) {
    // In a real scenario, this would initialize or clone a git repo
  }

  async getDocumentContent(docPath: string): Promise<string> {
    const content = this.files.get(docPath);
    if (content === undefined) {
      throw new Error(`Document ${docPath} not found.`);
    }
    return content;
  }

  async commitDocument(docPath: string, content: string, message: string, authorName: string, authorEmail: string): Promise<void> {
    this.files.set(docPath, content);
    this.history.push({ docPath, content, message });
    // console.log(`Mock: Committed ${docPath} by ${authorName} with message: "${message}"`);
  }

  async getDocumentDiff(docPath: string): Promise<string> {
    const currentContent = this.files.get(docPath);
    if (currentContent === undefined) {
      throw new Error(`Document ${docPath} not found for diff.`);
    }
    
    // Simulate a simple diff against the immediately previous committed version
    const relevantHistory = this.history.filter(entry => entry.docPath === docPath);
    const previousEntry = relevantHistory.length > 1 ? relevantHistory[relevantHistory.length - 2] : null;
    const previousContent = previousEntry ? previousEntry.content : '';

    if (currentContent === previousContent) {
      return 'No changes.';
    }

    const oldLines = previousContent.split('\n');
    const newLines = currentContent.split('\n');
    let diffOutput = '';

    // Very naive line-by-line diff simulation
    const maxLength = Math.max(oldLines.length, newLines.length);
    for (let i = 0; i < maxLength; i++) {
        const oldLine = oldLines[i];
        const newLine = newLines[i];

        if (oldLine !== newLine) {
            if (oldLine !== undefined) diffOutput += `-${oldLine}\n`;
            if (newLine !== undefined) diffOutput += `+${newLine}\n`;
        } else if (oldLine !== undefined) {
            diffOutput += ` ${oldLine}\n`; // Unchanged line
        }
    }

    return diffOutput.trim();
  }
}

describe('MockGitOperations', () => {
  let gitService: MockGitOperations;

  beforeEach(() => {
    gitService = new MockGitOperations('./mock-repo');
  });

  it('should commit a new document and retrieve its content', async () => {
    const docPath = 'new-doc.md';
    const content = '# Hello Amélie\nThis is a test.';
    const message = 'Initial document';
    const author = 'Amélie Agent';
    const email = 'agent@amelie.org';

    await gitService.commitDocument(docPath, content, message, author, email);
    const retrievedContent = await gitService.getDocumentContent(docPath);

    expect(retrievedContent).toBe(content);
  });

  it('should update an existing document and show changes', async () => {
    const docPath = 'existing-doc.txt';
    const initialContent = 'Line 1\nLine 2';
    const updatedContent = 'Line 1\nNew Line 2\nLine 3';

    await gitService.commitDocument(docPath, initialContent, 'Initial', 'A', 'a@b.c');
    await gitService.commitDocument(docPath, updatedContent, 'Update', 'A', 'a@b.c');

    const retrievedContent = await gitService.getDocumentContent(docPath);
    expect(retrievedContent).toBe(updatedContent);
  });

  it('should generate a simple diff between versions', async () => {
    const docPath = 'diff-doc.md';
    const initialContent = 'Alpha\nBeta\nGamma';
    const secondContent = 'Alpha\nDelta\nGamma\nEpsilon';
    const thirdContent = 'Alpha\nDelta\nOmega\nEpsilon';

    await gitService.commitDocument(docPath, initialContent, 'v1', 'Test', 'test@amelie.org');
    await gitService.commitDocument(docPath, secondContent, 'v2', 'Test', 'test@amelie.org');
    await gitService.commitDocument(docPath, thirdContent, 'v3', 'Test', 'test@amelie.org');

    // The mock diffs the current state against the second-to-last entry in its history.
    const diff = await gitService.getDocumentDiff(docPath);
    expect(diff).toContain('-Gamma');
    expect(diff).toContain('+Omega');
    expect(diff).toContain(' Delta'); // Unchanged line should be present
    expect(diff).not.toContain('Beta'); // Beta was removed earlier, not in the direct diff
  });

  it('should throw error if document not found', async () => {
    await expect(gitService.getDocumentContent('non-existent.md')).rejects.toThrow('Document non-existent.md not found.');
  });
});
