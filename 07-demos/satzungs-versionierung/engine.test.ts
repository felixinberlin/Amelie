import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GitBylawService } from './07-demos/satzungs-versionierung'; // Assuming the service is in this path
import fs from 'node:fs/promises';
import path from 'node:path';
import { simpleGit } from 'simple-git';

describe('GitBylawService', () => {
  let service: GitBylawService;
  let tempDir: string;

  beforeEach(async () => {
    tempDir = path.join(process.cwd(), `temp-git-repo-${Date.now()}`);
    service = new GitBylawService(tempDir);
    await service.initRepo(tempDir);
    return async () => {
      // Cleanup the temporary directory after each test
      await fs.rm(tempDir, { recursive: true, force: true });
    };
  });

  it('should initialize a git repository', async () => {
    const git = simpleGit(tempDir);
    const status = await git.status();
    expect(status.is.notARepo).toBe(false);
    expect(status.is.clean).toBe(true);
  });

  it('should add and commit a new bylaw', async () => {
    const bylawName = 'Gebuehrenordnung';
    const content = '# Gebührenordnung\n§1 Geltungsbereich\nDiese Gebührenordnung gilt für alle Leistungen der Stadt.';
    const commitMessage = 'Initial version of Gebührenordnung';

    const version = await service.addBylaw(bylawName, content, commitMessage);
    expect(version).toBeDefined();
    expect(version.hash).toHaveLength(40);
    expect(version.message).toBe(commitMessage);

    const history = await service.getBylawHistory(bylawName);
    expect(history).toHaveLength(1);
    expect(history[0].content).toBe(content);
  });

  it('should update an existing bylaw and track its history', async () => {
    const bylawName = 'Polizeiverordnung';
    const initialContent = '# Polizeiverordnung\n§1 Ruhezeiten\nDie Ruhezeiten sind von 22:00 bis 6:00 Uhr.';
    const firstCommitMsg = 'Initial Polizeiverordnung';
    const initialVersion = await service.addBylaw(bylawName, initialContent, firstCommitMsg);

    const updatedContent = '# Polizeiverordnung\n§1 Ruhezeiten\nDie Ruhezeiten sind von 22:00 bis 7:00 Uhr.\n§2 Lärmschutz\nUnnötiger Lärm ist zu vermeiden.';
    const secondCommitMsg = 'Update Ruhezeiten and add Lärmschutz';
    const updatedVersion = await service.updateBylaw(bylawName, updatedContent, secondCommitMsg);

    expect(updatedVersion.hash).not.toBe(initialVersion.hash);
    expect(updatedVersion.message).toBe(secondCommitMsg);

    const history = await service.getBylawHistory(bylawName);
    expect(history).toHaveLength(2);
    expect(history[0].content).toBe(updatedContent);
    expect(history[1].content).toBe(initialContent);
  });

  it('should retrieve a specific version of a bylaw by hash', async () => {
    const bylawName = 'Bebauungsplan';
    const contentV1 = 'Version 1 content';
    const contentV2 = 'Version 2 content';

    const v1 = await service.addBylaw(bylawName, contentV1, 'Initial');
    const v2 = await service.updateBylaw(bylawName, contentV2, 'Update');

    const retrievedV1 = await service.getBylawVersion(bylawName, v1.hash);
    expect(retrievedV1?.content).toBe(contentV1);

    const retrievedV2 = await service.getBylawVersion(bylawName, v2.hash);
    expect(retrievedV2?.content).toBe(contentV2);
  });

  it('should return null for a non-existent bylaw version', async () => {
    const bylawName = 'NonExistent';
    const nonExistentHash = 'a'.repeat(40);
    const result = await service.getBylawVersion(bylawName, nonExistentHash);
    expect(result).toBeNull();
  });

  it('should get the consolidated (latest) version of a bylaw', async () => {
    const bylawName = 'Strassenreinigungssatzung';
    const contentV1 = 'Initial content';
    const contentV2 = 'Latest content';

    await service.addBylaw(bylawName, contentV1, 'V1');
    await service.updateBylaw(bylawName, contentV2, 'V2');

    const latest = await service.getConsolidatedBylaw(bylawName);
    expect(latest?.content).toBe(contentV2);
  });

  it('should generate a diff between two versions of a bylaw', async () => {
    const bylawName = 'Feuerwehrgebuehren';
    const contentV1 = '§1 Gebühren\nFür Einsätze der Feuerwehr werden Gebühren erhoben.\n§2 Ausnahmen\nKeine Gebühren für Brandbekämpfung.';
    const contentV2 = '§1 Gebühren\nFür Einsätze der Feuerwehr werden Gebühren erhoben.\n§2 Ausnahmen\nKeine Gebühren bei Notfällen und Brandbekämpfung.';

    const v1 = await service.addBylaw(bylawName, contentV1, 'Initial');
    const v2 = await service.updateBylaw(bylawName, contentV2, 'Add Notfälle exception');

    const diff = await service.getBylawDiff(bylawName, v1.hash, v2.hash);
    expect(diff).toContain('-Keine Gebühren für Brandbekämpfung.');
    expect(diff).toContain('+Keine Gebühren bei Notfällen und Brandbekämpfung.');
    expect(diff).not.toContain('§1 Gebühren'); // Unchanged part should not be in diff line by line
  });

  it('should handle multiple bylaws in the same repository', async () => {
    const bylaw1Name = 'Hundesteuer';
    const bylaw2Name = 'Marktordnung';
    const content1 = 'Hundesteuer content';
    const content2 = 'Marktordnung content';

    await service.addBylaw(bylaw1Name, content1, 'Add Hundesteuer');
    await service.addBylaw(bylaw2Name, content2, 'Add Marktordnung');

    const history1 = await service.getBylawHistory(bylaw1Name);
    expect(history1).toHaveLength(1);
    expect(history1[0].content).toBe(content1);

    const history2 = await service.getBylawHistory(bylaw2Name);
    expect(history2).toHaveLength(1);
    expect(history2[0].content).toBe(content2);

    const latest1 = await service.getConsolidatedBylaw(bylaw1Name);
    expect(latest1?.content).toBe(content1);
  });

  it('should create and merge a bylaw branch', async () => {
    const bylawName = 'TestSatzung';
    const initialContent = 'Initial content for TestSatzung.';
    const branchContent = 'Content updated in branch.';
    const finalContent = 'Content updated in branch.'; // Should be the merged content

    await service.addBylaw(bylawName, initialContent, 'Initial commit');

    const newBranchName = 'feature/amendment-proposal';
    await service.createBylawBranch(bylawName, newBranchName);

    // Switch to the new branch to make changes
    const git = simpleGit(tempDir);
    await git.checkout(newBranchName);
    await service.updateBylaw(bylawName, branchContent, 'Update in branch');

    // Merge the branch back to main
    const mergedVersion = await service.mergeBylawBranch(bylawName, newBranchName, 'Merge amendment proposal');

    expect(mergedVersion.content).toBe(finalContent);
    expect(mergedVersion.message).toContain('Merge amendment proposal');

    // Verify the branch is deleted (optional, but good practice for feature branches)
    const branches = await git.branchLocal();
    expect(branches.all).not.toContain(newBranchName);

    // Verify main branch now has the updated content
    const latestMain = await service.getConsolidatedBylaw(bylawName);
    expect(latestMain?.content).toBe(finalContent);
  });

  it('should handle merging with no changes in branch gracefully', async () => {
    const bylawName = 'NoChangeBylaw';
    const initialContent = 'Original content.';
    await service.addBylaw(bylawName, initialContent, 'Initial commit');

    const branchName = 'no-change-branch';
    await service.createBylawBranch(bylawName, branchName);

    // Switch back to main for the merge
    const git = simpleGit(tempDir);
    await git.checkout('main');

    // Attempt to merge a branch with no new changes
    // simple-git's mergeFromTo will still create a merge commit if no fast-forward is possible
    const mergedVersion = await service.mergeBylawBranch(bylawName, branchName, 'Merge no-change branch');

    expect(mergedVersion.content).toBe(initialContent);
    expect(mergedVersion.message).toContain('Merge no-change branch');
  });
});
