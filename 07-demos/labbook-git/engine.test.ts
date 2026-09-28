import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { simpleGit, SimpleGitOptions } from 'simple-git';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Helper to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock current working directory for testing purposes
const TEST_REPO_DIR = path.join(__dirname, 'temp_test_repo');

describe('LabBook-Git Core Functionality', () => {
  let git: ReturnType<typeof simpleGit>;

  beforeEach(async () => {
    // Clean up previous test run artifacts
    await fs.rm(TEST_REPO_DIR, { recursive: true, force: true });
    await fs.mkdir(TEST_REPO_DIR, { recursive: true });

    const options: Partial<SimpleGitOptions> = {
      baseDir: TEST_REPO_DIR,
      binary: 'git',
      maxConcurrentProcesses: 6,
    };
    git = simpleGit(options);

    // Initialize a new git repository for each test
    await git.init();
    await git.addConfig('user.email', 'test@example.com');
    await git.addConfig('user.name', 'Test User');
  });

  afterEach(async () => {
    // Clean up the test repository
    await fs.rm(TEST_REPO_DIR, { recursive: true, force: true });
  });

  it('should initialize a new experiment repository', async () => {
    // Check if .git directory exists
    const gitDirExists = await fs.stat(path.join(TEST_REPO_DIR, '.git')).then(() => true).catch(() => false);
    expect(gitDirExists).toBe(true);

    // Check for an initial commit if desired (or just the repo existence)
    const log = await git.log();
    expect(log.total).toBe(0); // No commits yet, just init
  });

  it('should record experiment metadata as a commit', async () => {
    const metadataFile = path.join(TEST_REPO_DIR, 'experiment_metadata.json');
    const metadata = { experimentId: 'exp-001', date: '2023-10-27', parameters: { temp: '25C', duration: '1h' } };

    await fs.writeFile(metadataFile, JSON.stringify(metadata, null, 2));
    await git.add(metadataFile);
    await git.commit('Initial experiment setup for exp-001');

    const log = await git.log();
    expect(log.total).toBe(1);
    expect(log.latest?.message).toBe('Initial experiment setup for exp-001');

    const status = await git.status();
    expect(status.files).toHaveLength(0); // All changes committed
  });

  it('should track changes to data processing scripts', async () => {
    const scriptFile = path.join(TEST_REPO_DIR, 'process_data.py');

    // Initial script version
    await fs.writeFile(scriptFile, 'print(\"Version 1\")');
    await git.add(scriptFile);
    await git.commit('Add initial data processing script');

    // Modify script
    await fs.writeFile(scriptFile, 'print(\"Version 2 with new algorithm\")');
    await git.add(scriptFile);
    await git.commit('Update data processing script to Version 2');

    const log = await git.log();
    expect(log.total).toBe(2);
    expect(log.latest?.message).toBe('Update data processing script to Version 2');

    const diff = await git.diff(['HEAD~1', 'HEAD', scriptFile]);
    expect(diff).toContain('-print(\"Version 1\")');
    expect(diff).toContain('+print(\"Version 2 with new algorithm\")');
  });

  it('should use a custom function to "commit" a data artifact hash', async () => {
    // This test simulates how LabBook-Git would abstract Git for data artifacts.
    // In a real scenario, this would involve hashing a data file and committing the hash/metadata.
    const dataArtifactFile = path.join(TEST_REPO_DIR, 'processed_data.csv');
    const dummyData = 'col1,col2\n1,A\n2,B';
    await fs.writeFile(dataArtifactFile, dummyData);

    // Simulate generating a hash for the data artifact
    const crypto = await import('node:crypto');
    const dataHash = crypto.createHash('sha256').update(dummyData).digest('hex');

    // Simulate LabBook-Git's internal metadata file for data artifacts
    const artifactMetaFile = path.join(TEST_REPO_DIR, 'artifacts.json');
    const artifactMeta = { 'processed_data.csv': { hash: dataHash, description: 'Raw data processed with script v1' } };
    await fs.writeFile(artifactMetaFile, JSON.stringify(artifactMeta, null, 2));

    await git.add(artifactMetaFile);
    await git.commit(`Record processed_data.csv artifact with hash ${dataHash.substring(0, 8)}`);

    const log = await git.log();
    expect(log.total).toBe(1);
    expect(log.latest?.message).toContain('Record processed_data.csv artifact');

    const committedMeta = JSON.parse(await git.show([`HEAD:${path.basename(artifactMetaFile)}`])) as typeof artifactMeta;
    expect(committedMeta['processed_data.csv'].hash).toBe(dataHash);
  });

  it('should allow branching for different experimental hypotheses', async () => {
    await git.commit('Initial setup'); // Need at least one commit to branch
    await git.branch('hypothesis-A');
    await git.checkout('hypothesis-A');

    const branchList = await git.branchLocal();
    expect(branchList.all).toContain('hypothesis-A');
    expect(branchList.current).toBe('hypothesis-A');
  });

  it('should support tagging specific milestones or published datasets', async () => {
    await git.commit('Initial data capture');
    await git.tag(['v1.0.0-published-dataset']);

    const tags = await git.tag(['--list']);
    expect(tags).toContain('v1.0.0-published-dataset');
  });
});
