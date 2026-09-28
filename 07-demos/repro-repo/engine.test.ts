import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mocking a simplified Git-like API for testing purposes
const mockGitApi = {
  repositories: new Map(),
  createRepo: vi.fn((repoId, owner, description) => {
    if (mockGitApi.repositories.has(repoId)) {
      throw new Error('Repository already exists');
    }
    const newRepo = { id: repoId, owner, description, files: {}, history: [] };
    mockGitApi.repositories.set(repoId, newRepo);
    return newRepo;
  }),
  addFile: vi.fn((repoId, filePath, content, author, message) => {
    const repo = mockGitApi.repositories.get(repoId);
    if (!repo) throw new Error('Repository not found');
    repo.files[filePath] = content;
    repo.history.push({ type: 'add', filePath, author, message, timestamp: new Date() });
    return repo.files[filePath];
  }),
  updateFile: vi.fn((repoId, filePath, newContent, author, message) => {
    const repo = mockGitApi.repositories.get(repoId);
    if (!repo) throw new Error('Repository not found');
    if (!(filePath in repo.files)) throw new Error('File not found');
    repo.files[filePath] = newContent;
    repo.history.push({ type: 'update', filePath, author, message, timestamp: new Date() });
    return repo.files[filePath];
  }),
  getFileContent: vi.fn((repoId, filePath) => {
    const repo = mockGitApi.repositories.get(repoId);
    if (!repo) throw new Error('Repository not found');
    return repo.files[filePath];
  }),
  getRepoHistory: vi.fn((repoId) => {
    const repo = mockGitApi.repositories.get(repoId);
    if (!repo) throw new Error('Repository not found');
    return [...repo.history];
  }),
  forkRepo: vi.fn((sourceRepoId, newRepoId, newOwner) => {
    const sourceRepo = mockGitApi.repositories.get(sourceRepoId);
    if (!sourceRepo) throw new Error('Source repository not found');
    if (mockGitApi.repositories.has(newRepoId)) throw new Error('Fork target repository already exists');

    const forkedRepo = {
      ...sourceRepo,
      id: newRepoId,
      owner: newOwner,
      files: { ...sourceRepo.files }, // Deep copy files
      history: [{ type: 'fork', from: sourceRepoId, author: newOwner, timestamp: new Date() }]
    };
    mockGitApi.repositories.set(newRepoId, forkedRepo);
    return forkedRepo;
  }),
  // Simplified PR: just merges changes from source to target without conflict resolution
  mergePullRequest: vi.fn((sourceRepoId, targetRepoId, author, message) => {
    const sourceRepo = mockGitApi.repositories.get(sourceRepoId);
    const targetRepo = mockGitApi.repositories.get(targetRepoId);
    if (!sourceRepo || !targetRepo) throw new Error('Source or target repository not found');

    Object.assign(targetRepo.files, sourceRepo.files); // Simple merge, overwrites files
    targetRepo.history.push({
      type: 'merge', from: sourceRepoId, author, message, timestamp: new Date()
    });
    return targetRepo;
  })
};

describe('ReproRepo Core Functionality (Git-like abstraction)', () => {
  beforeEach(() => {
    mockGitApi.repositories.clear();
    vi.clearAllMocks();
  });

  it('should create a new research data repository', () => {
    const repo = mockGitApi.createRepo('dataset-alpha', 'Alice', 'Experimental results for study A');
    expect(repo).toBeDefined();
    expect(repo.id).toBe('dataset-alpha');
    expect(mockGitApi.repositories.has('dataset-alpha')).toBe(true);
    expect(mockGitApi.createRepo).toHaveBeenCalledWith('dataset-alpha', 'Alice', 'Experimental results for study A');
  });

  it('should add and retrieve files from a repository', () => {
    mockGitApi.createRepo('dataset-beta', 'Bob', 'Survey data for urban planning');
    mockGitApi.addFile('dataset-beta', 'survey.csv', 'id,age,city\n1,30,Berlin', 'Bob', 'Initial survey data');
    const content = mockGitApi.getFileContent('dataset-beta', 'survey.csv');
    expect(content).toBe('id,age,city\n1,30,Berlin');
    expect(mockGitApi.getRepoHistory('dataset-beta')).toHaveLength(1);
  });

  it('should update files and track history', () => {
    mockGitApi.createRepo('protocol-v1', 'Charlie', 'Lab protocol for chemical synthesis');
    mockGitApi.addFile('protocol-v1', 'method.md', '# Protocol v1', 'Charlie', 'Initial draft');
    mockGitApi.updateFile('protocol-v1', 'method.md', '# Protocol v1.1\nUpdated steps.', 'Charlie', 'Refined steps');
    const content = mockGitApi.getFileContent('protocol-v1', 'method.md');
    expect(content).toContain('Updated steps.');
    const history = mockGitApi.getRepoHistory('protocol-v1');
    expect(history).toHaveLength(2);
    expect(history[1].type).toBe('update');
    expect(history[1].message).toBe('Refined steps');
  });

  it('should allow forking a repository for collaborative work', () => {
    mockGitApi.createRepo('public-dataset', 'ResearcherA', 'Publicly available research data');
    mockGitApi.addFile('public-dataset', 'data.json', '{ "key": "value" }', 'ResearcherA', 'Initial data upload');

    const forkedRepo = mockGitApi.forkRepo('public-dataset', 'my-analysis-fork', 'ResearcherB');
    expect(forkedRepo).toBeDefined();
    expect(forkedRepo.id).toBe('my-analysis-fork');
    expect(forkedRepo.owner).toBe('ResearcherB');
    expect(mockGitApi.getFileContent('my-analysis-fork', 'data.json')).toBe('{ "key": "value" }');
    expect(mockGitApi.getRepoHistory('my-analysis-fork')[0].type).toBe('fork');
  });

  it('should simulate a pull request (merge from fork back to original)', () => {
    mockGitApi.createRepo('main-project', 'OrgA', 'Main project repository');
    mockGitApi.addFile('main-project', 'config.yml', 'version: 1', 'OrgA', 'Initial config');

    mockGitApi.forkRepo('main-project', 'dev-branch', 'DevTeam');
    mockGitApi.updateFile('dev-branch', 'config.yml', 'version: 2\nfeature: enabled', 'DevTeam', 'Add new feature config');

    // Simulate PR merge
    const mergedRepo = mockGitApi.mergePullRequest('dev-branch', 'main-project', 'OrgA', 'Merge new feature config from dev-branch');
    expect(mockGitApi.getFileContent('main-project', 'config.yml')).toContain('version: 2');
    expect(mockGitApi.getFileContent('main-project', 'config.yml')).toContain('feature: enabled');
    expect(mockGitApi.getRepoHistory('main-project')).toHaveLength(2); // Initial add + merge
    expect(mockGitApi.getRepoHistory('main-project')[1].type).toBe('merge');
  });

  it('should throw error if repository not found for file operations', () => {
    expect(() => mockGitApi.addFile('non-existent', 'file.txt', 'content', 'user', 'msg')).toThrow('Repository not found');
    expect(() => mockGitApi.getFileContent('non-existent', 'file.txt')).toThrow('Repository not found');
  });

  it('should throw error if file not found for update', () => {
    mockGitApi.createRepo('test-repo', 'user', 'desc');
    expect(() => mockGitApi.updateFile('test-repo', 'non-existent.txt', 'new', 'user', 'msg')).toThrow('File not found');
  });
});
