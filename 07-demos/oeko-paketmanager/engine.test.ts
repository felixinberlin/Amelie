import { describe, it, expect } from 'vitest';

type EcoPackageType = 'plant' | 'soil' | 'water_system' | 'biotope_module' | 'infrastructure';

interface EcoPackage {
  id: string;
  name: string;
  type: EcoPackageType;
  version: string;
  attributes: Record<string, any>;
  dependencies: string[]; // IDs of packages this one depends on
  conflicts: string[];    // IDs of packages this one is incompatible with
  provides: string[];     // IDs of services/resources this package provides
}

interface EcoIntervention {
  type: 'add' | 'remove' | 'update';
  packageId: string;
  newPackage?: EcoPackage; // For 'add' or 'update'
}

class EcoSystemManager {
  private packages: Map<string, EcoPackage>;

  constructor() {
    this.packages = new Map();
  }

  addPackage(pkg: EcoPackage): boolean {
    if (this.packages.has(pkg.id)) {
      return false; // Package with this ID already exists
    }
    this.packages.set(pkg.id, pkg);
    return true;
  }

  removePackage(packageId: string): boolean {
    if (!this.packages.has(packageId)) {
      return false;
    }
    // Check if any other package depends on this one
    for (const pkg of this.packages.values()) {
      if (pkg.dependencies.includes(packageId)) {
        throw new Error(`Cannot remove package '${packageId}'. It is a dependency for '${pkg.id}'.`);
      }
    }
    this.packages.delete(packageId);
    return true;
  }

  getPackage(packageId: string): EcoPackage | undefined {
    return this.packages.get(packageId);
  }

  getAllPackages(): EcoPackage[] {
    return Array.from(this.packages.values());
  }

  checkConflicts(packageId: string): string[] {
    const pkg = this.packages.get(packageId);
    if (!pkg) {
      return [];
    }
    const conflictsFound: string[] = [];
    for (const otherPkg of this.packages.values()) {
      if (pkg.id === otherPkg.id) continue;
      if (pkg.conflicts.includes(otherPkg.id)) {
        conflictsFound.push(otherPkg.id);
      }
      if (otherPkg.conflicts.includes(pkg.id)) {
        conflictsFound.push(otherPkg.id);
      }
    }
    return Array.from(new Set(conflictsFound)); // Remove duplicates
  }

  checkMissingDependencies(packageId: string): string[] {
    const pkg = this.packages.get(packageId);
    if (!pkg) {
      return [];
    }
    const missing: string[] = [];
    for (const depId of pkg.dependencies) {
      if (!this.packages.has(depId)) {
        missing.push(depId);
      }
    }
    return missing;
  }

  /**
   * Simulates an intervention and returns potential impacts (conflicts, missing deps).
   * This is a simplified simulation for demonstration.
   */
  simulateIntervention(intervention: EcoIntervention): {
    conflicts: Record<string, string[]>;
    missingDependencies: Record<string, string[]>;
    impactedPackages: string[];
  } {
    const tempManager = new EcoSystemManager();
    // Populate tempManager with current state
    this.getAllPackages().forEach(pkg => tempManager.addPackage({ ...pkg }));

    let targetPackage: EcoPackage | undefined;

    if (intervention.type === 'add' && intervention.newPackage) {
      tempManager.addPackage(intervention.newPackage);
      targetPackage = intervention.newPackage;
    } else if (intervention.type === 'remove') {
      try {
        tempManager.removePackage(intervention.packageId);
      } catch (e) {
        // Handle removal dependencies in simulation
        console.warn(`Simulated removal failed: ${e.message}`);
      }
    } else if (intervention.type === 'update' && intervention.newPackage) {
      // For update, remove old and add new. Simpler for now.
      try {
        tempManager.removePackage(intervention.packageId);
      } catch (e) {
        console.warn(`Simulated update (remove old) failed: ${e.message}`);
      }
      tempManager.addPackage(intervention.newPackage);
      targetPackage = intervention.newPackage;
    }

    const conflicts: Record<string, string[]> = {};
    const missingDependencies: Record<string, string[]> = {};
    const impactedPackages: Set<string> = new Set();

    // Re-evaluate the entire system or just around the intervention
    for (const pkg of tempManager.getAllPackages()) {
      const pkgConflicts = tempManager.checkConflicts(pkg.id);
      if (pkgConflicts.length > 0) {
        conflicts[pkg.id] = pkgConflicts;
        impactedPackages.add(pkg.id);
        pkgConflicts.forEach(c => impactedPackages.add(c));
      }
      const pkgMissingDeps = tempManager.checkMissingDependencies(pkg.id);
      if (pkgMissingDeps.length > 0) {
        missingDependencies[pkg.id] = pkgMissingDeps;
        impactedPackages.add(pkg.id);
      }
    }

    // If a package was added/updated, include its direct impacts
    if (targetPackage) {
      impactedPackages.add(targetPackage.id);
      targetPackage.dependencies.forEach(dep => impactedPackages.add(dep));
      targetPackage.conflicts.forEach(con => impactedPackages.add(con));
      // Also check packages that now depend on or conflict with the new one
      for (const pkg of tempManager.getAllPackages()) {
        if (pkg.dependencies.includes(targetPackage.id) || pkg.conflicts.includes(targetPackage.id)) {
          impactedPackages.add(pkg.id);
        }
      }
    }

    return {
      conflicts,
      missingDependencies,
      impactedPackages: Array.from(impactedPackages),
    };
  }
}

describe('EcoSystemManager', () => {
  let manager: EcoSystemManager;

  beforeEach(() => {
    manager = new EcoSystemManager();
  });

  const oakTree: EcoPackage = {
    id: 'oak-001',
    name: 'Quercus robur',
    type: 'plant',
    version: '1.0.0',
    attributes: { height: '20m', water_needs: 'medium', soil_preference: 'loamy' },
    dependencies: ['healthy-loamy-soil-v1'],
    conflicts: ['invasive-himalayan-balsam'],
    provides: ['shade', 'habitat-squirrel', 'habitat-jay'],
  };

  const healthySoil: EcoPackage = {
    id: 'healthy-loamy-soil-v1',
    name: 'Healthy Loamy Soil',
    type: 'soil',
    version: '1.0.0',
    attributes: { ph: 6.5, drainage: 'medium' },
    dependencies: [],
    conflicts: ['toxic-runoff-zone'],
    provides: ['nutrient-base'],
  };

  const invasiveBalsam: EcoPackage = {
    id: 'invasive-himalayan-balsam',
    name: 'Himalayan Balsam',
    type: 'plant',
    version: '1.0.0',
    attributes: { growth_rate: 'fast', invasiveness: 'high' },
    dependencies: [],
    conflicts: ['native-wildflower-meadow', 'oak-001'],
    provides: [],
  };

  const wildflowerMeadow: EcoPackage = {
    id: 'native-wildflower-meadow',
    name: 'Native Wildflower Meadow',
    type: 'plant',
    version: '1.0.0',
    attributes: { biodiversity_score: 'high' },
    dependencies: ['healthy-loamy-soil-v1'],
    conflicts: ['invasive-himalayan-balsam'],
    provides: ['pollinator-habitat'],
  };

  it('should add a package successfully', () => {
    expect(manager.addPackage(oakTree)).toBe(true);
    expect(manager.getPackage('oak-001')).toEqual(oakTree);
  });

  it('should not add a package with a duplicate ID', () => {
    manager.addPackage(oakTree);
    expect(manager.addPackage(oakTree)).toBe(false);
  });

  it('should remove a package successfully if no other package depends on it', () => {
    manager.addPackage(oakTree);
    expect(manager.removePackage('oak-001')).toBe(true);
    expect(manager.getPackage('oak-001')).toBeUndefined();
  });

  it('should throw an error if attempting to remove a package with active dependencies', () => {
    manager.addPackage(healthySoil);
    manager.addPackage(oakTree); // oakTree depends on healthySoil
    expect(() => manager.removePackage('healthy-loamy-soil-v1')).toThrow("Cannot remove package 'healthy-loamy-soil-v1'. It is a dependency for 'oak-001'.");
  });

  it('should check for conflicts correctly', () => {
    manager.addPackage(oakTree);
    manager.addPackage(invasiveBalsam);
    manager.addPackage(healthySoil);

    const conflictsForOak = manager.checkConflicts('oak-001');
    expect(conflictsForOak).toContain('invasive-himalayan-balsam');
    expect(conflictsForOak.length).toBe(1);

    const conflictsForBalsam = manager.checkConflicts('invasive-himalayan-balsam');
    expect(conflictsForBalsam).toContain('oak-001');
    expect(conflictsForBalsam.length).toBe(1);

    const conflictsForSoil = manager.checkConflicts('healthy-loamy-soil-v1');
    expect(conflictsForSoil.length).toBe(0);
  });

  it('should check for missing dependencies correctly', () => {
    manager.addPackage(oakTree);
    // healthy-loamy-soil-v1 is missing initially
    expect(manager.checkMissingDependencies('oak-001')).toEqual(['healthy-loamy-soil-v1']);

    manager.addPackage(healthySoil);
    expect(manager.checkMissingDependencies('oak-001')).toEqual([]);
  });

  it('should simulate adding a package and report impacts', () => {
    manager.addPackage(healthySoil);
    manager.addPackage(wildflowerMeadow);

    const simulationResult = manager.simulateIntervention({
      type: 'add',
      packageId: 'invasive-himalayan-balsam',
      newPackage: invasiveBalsam,
    });

    // Balsam conflicts with wildflower meadow and oak-001 (if oak was present)
    expect(simulationResult.conflicts['invasive-himalayan-balsam']).toContain('native-wildflower-meadow');
    expect(simulationResult.conflicts['native-wildflower-meadow']).toContain('invasive-himalayan-balsam');
    expect(simulationResult.impactedPackages).toContain('invasive-himalayan-balsam');
    expect(simulationResult.impactedPackages).toContain('native-wildflower-meadow');
    expect(Object.keys(simulationResult.missingDependencies).length).toBe(0);
  });

  it('should simulate removing a package and report impacts (e.g., new missing dependencies)', () => {
    manager.addPackage(healthySoil);
    manager.addPackage(oakTree);

    const simulationResult = manager.simulateIntervention({
      type: 'remove',
      packageId: 'healthy-loamy-soil-v1',
    });

    // oakTree depends on healthy-loamy-soil-v1, so removing it creates a missing dependency
    expect(simulationResult.missingDependencies['oak-001']).toContain('healthy-loamy-soil-v1');
    expect(simulationResult.impactedPackages).toContain('oak-001');
    expect(Object.keys(simulationResult.conflicts).length).toBe(0);
  });

  it('should simulate updating a package and report impacts', () => {
    // Scenario: An existing native meadow is replaced by an invasive one (simulated as update)
    manager.addPackage(healthySoil);
    manager.addPackage(wildflowerMeadow); // Initial state

    const updatedMeadow: EcoPackage = {
      id: 'native-wildflower-meadow',
      name: 'Replaced Invasive Meadow',
      type: 'plant',
      version: '2.0.0',
      attributes: { invasiveness: 'medium' },
      dependencies: [],
      conflicts: ['oak-001'], // Let's say this new version conflicts with oak for some reason
      provides: [],
    };

    const simulationResult = manager.simulateIntervention({
      type: 'update',
      packageId: 'native-wildflower-meadow',
      newPackage: updatedMeadow,
    });

    // In this simplified update, we expect conflicts if oak-001 was present.
    // Since oak-001 is not in the manager, no direct conflict is shown from the `updatedMeadow`'s perspective.
    // However, if other packages depended on the *original* wildflowerMeadow, those would now have missing dependencies.
    // For this test, let's just assert that the 'updatedMeadow' is considered and no general conflicts arise without other conflicting packages.
    expect(simulationResult.impactedPackages).toContain('native-wildflower-meadow'); // The updated package itself
    expect(Object.keys(simulationResult.conflicts).length).toBe(0); // No other package conflicts with 'Replaced Invasive Meadow' currently
    expect(Object.keys(simulationResult.missingDependencies).length).toBe(0); // No other packages now miss the original meadow
  });
});