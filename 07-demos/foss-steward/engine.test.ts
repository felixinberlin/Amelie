// 07-demos/foss-steward/tests/foss-steward.test.ts

import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { FOSSSteward } from '../src/index'; // Adjust path as needed
import { Octokit } from '@octokit/rest';
import { SimpleGit, simpleGit } from 'simple-git';

// Mock Octokit and simple-git to prevent actual API calls and file system operations during tests
vi.mock('@octokit/rest', () => {
  const mockOctokit = {
    repos: {
      get: vi.fn(() => ({
        data: {
          html_url: 'https://github.com/test/repo',
          pushed_at: new Date().toISOString(),
          has_wiki: true,
          has_pages: false,
          license: { spdx_id: 'MIT' }
        }
      })),
      listCommits: vi.fn(() => ({
        data: [{ commit: { author: { date: new Date().toISOString() } } }]
      })),
      listContributors: vi.fn(() => ({
        data: [{ login: 'contributor1' }, { login: 'contributor2' }, { login: 'contributor3' }]
      }))
    },
    issues: {
      listForRepo: vi.fn(() => ({
        data: [
          { state: 'open' }, { state: 'open' }, { state: 'closed' }, { state: 'closed' }, { state: 'closed' }
        ]
      }))
    }
  };
  return { Octokit: vi.fn(() => mockOctokit) };
});

vi.mock('simple-git', () => {
  const mockSimpleGit = {
    cwd: vi.fn(() => mockSimpleGit),
    branchLocal: vi.fn(() => ({
      all: ['main', 'feature/test']
    }))
  };
  return { simpleGit: vi.fn(() => mockSimpleGit) };
});

describe('FOSSSteward', () => {
  let steward: FOSSSteward;
  const mockGithubToken = 'mock-token';

  beforeAll(() => {
    steward = new FOSSSteward(mockGithubToken);
  });

  it('should initialize with a GitHub token', () => {
    expect(Octokit).toHaveBeenCalledWith({ auth: mockGithubToken });
    expect(steward).toBeInstanceOf(FOSSSteward);
  });

  it('should throw an error if GitHub token is not provided for GitHub analysis', async () => {
    const stewardNoToken = new FOSSSteward();
    await expect(stewardNoToken.analyzeGitHubRepo('test', 'repo')).rejects.toThrow("GitHub token not provided. Cannot analyze GitHub repos.");
  });

  it('should analyze a GitHub repository and return health metrics', async () => {
    const owner = 'test';
    const repo = 'repo';
    const metrics = await steward.analyzeGitHubRepo(owner, repo);

    expect(metrics).toBeDefined();
    expect(metrics.repoUrl).toBe('https://github.com/test/repo');
    expect(metrics.activityScore).toBeGreaterThan(0);
    expect(metrics.busFactorScore).toBe(50); // 3 contributors -> score 50 (based on mock)
    expect(metrics.dependencySecurityScore).toBe(90); // 1 vulnerable / 10 total -> 90
    expect(metrics.licenseComplianceScore).toBe(95); // Has license -> 95
    expect(metrics.documentationScore).toBe(70); // Has wiki -> 70
    expect(metrics.activeContributors).toBe(3);
    expect(metrics.openIssuesRatio).toBe(2 / 5); // 2 open / 5 total
    expect(metrics.dependencyCount).toBe(10);
    expect(metrics.vulnerableDependencies).toBe(1);

    expect(vi.mocked(steward['octokit']?.repos.get)).toHaveBeenCalledWith({ owner, repo });
    expect(vi.mocked(steward['octokit']?.repos.listCommits)).toHaveBeenCalledWith({ owner, repo, per_page: 1 });
    expect(vi.mocked(steward['octokit']?.repos.listContributors)).toHaveBeenCalledWith({ owner, repo, anon: true });
    expect(vi.mocked(steward['octokit']?.issues.listForRepo)).toHaveBeenCalledWith({ owner, repo, state: 'all' });
  });

  it('should handle errors during GitHub repository analysis', async () => {
    vi.mocked(steward['octokit']?.repos.get).mockImplementationOnce(() => {
      throw new Error('API Rate Limit Exceeded');
    });

    await expect(steward.analyzeGitHubRepo('error', 'repo')).rejects.toThrow('API Rate Limit Exceeded');
  });

  it('should analyze a local git repository', async () => {
    const localPath = './mock-repo';
    const localMetrics = await steward.analyzeLocalRepo(localPath);

    expect(localMetrics).toBeDefined();
    expect(localMetrics.path).toBe(localPath);
    expect(localMetrics.branches).toEqual(['main', 'feature/test']);
    expect(vi.mocked(simpleGit().cwd)).toHaveBeenCalledWith(localPath);
    expect(vi.mocked(simpleGit().branchLocal)).toHaveBeenCalled();
  });

  it('should throw an error if simpleGit is not initialized for local repo analysis', async () => {
    const stewardNoGit = new FOSSSteward(mockGithubToken);
    stewardNoGit['git'] = null; // Manually nullify for test
    await expect(stewardNoGit.analyzeLocalRepo('./path')).rejects.toThrow("SimpleGit not initialized.");
  });

  it('should handle errors during local repository analysis', async () => {
    vi.mocked(simpleGit().branchLocal).mockImplementationOnce(() => {
      throw new Error('Git command failed');
    });

    await expect(steward.analyzeLocalRepo('./broken-repo')).rejects.toThrow('Git command failed');
  });
});
