// 07-demos/eco-stratege/src/core/models.ts

export interface EcoProject {
  id: string;
  name: string;
  cost: number; // in Euros
  expectedBiodiversityIncrease: number; // e.g., species richness index, scaled 0-100
  expectedCarbonSequestration: number; // in tons of CO2e per year
  expectedWaterQualityImprovement: number; // e.g., water quality index, scaled 0-100
  riskFactor: number; // scaled 0-100, higher is riskier
  durationYears: number;
  locationGeoJson?: string; // Optional GeoJSON for project area
}

export interface PortfolioWeights {
  biodiversity: number; // Weight for biodiversity impact
  carbon: number;       // Weight for carbon sequestration
  waterQuality: number; // Weight for water quality improvement
  costEfficiency: number; // Weight for cost efficiency (lower cost for higher impact)
  riskTolerance: number; // Weight for risk (lower risk preferred)
}

export interface PortfolioEvaluation {
  totalCost: number;
  weightedImpactScore: number;
  averageRisk: number;
  biodiversityScore: number;
  carbonScore: number;
  waterQualityScore: number;
}

export class EcoStrategist {
  private projects: EcoProject[];

  constructor(projects: EcoProject[] = []) {
    this.projects = projects;
  }

  addProject(project: EcoProject): void {
    if (this.projects.some(p => p.id === project.id)) {
      throw new Error(`Project with ID ${project.id} already exists.`);
    }
    this.projects.push(project);
  }

  getProject(id: string): EcoProject | undefined {
    return this.projects.find(p => p.id === id);
  }

  /**
   * Evaluates a given set of project IDs based on specified weights and budget.
   * Returns an aggregated score and other metrics.
   * @param projectIds - IDs of projects to include in the portfolio.
   * @param weights - Weights for different ecological and financial criteria.
   * @param maxBudget - Optional maximum budget for the portfolio.
   * @returns PortfolioEvaluation object.
   */
  evaluatePortfolio(
    projectIds: string[],
    weights: PortfolioWeights,
    maxBudget?: number
  ): PortfolioEvaluation {
    let totalCost = 0;
    let totalBiodiversity = 0;
    let totalCarbon = 0;
    let totalWaterQuality = 0;
    let totalRisk = 0;
    let projectCount = 0;

    const includedProjects: EcoProject[] = [];

    for (const id of projectIds) {
      const project = this.getProject(id);
      if (project) {
        if (maxBudget !== undefined && totalCost + project.cost > maxBudget) {
          // For this simple model, we just skip project if it exceeds budget
          continue;
        }
        includedProjects.push(project);
        totalCost += project.cost;
        totalBiodiversity += project.expectedBiodiversityIncrease;
        totalCarbon += project.expectedCarbonSequestration;
        totalWaterQuality += project.expectedWaterQualityImprovement;
        totalRisk += project.riskFactor;
        projectCount++;
      } else {
        console.warn(`Project with ID ${id} not found.`);
      }
    }

    if (projectCount === 0) {
      return {
        totalCost: 0,
        weightedImpactScore: 0,
        averageRisk: 0,
        biodiversityScore: 0,
        carbonScore: 0,
        waterQualityScore: 0,
      };
    }

    const averageRisk = totalRisk / projectCount;

    const biodiversityScore = totalBiodiversity;
    const carbonScore = totalCarbon;
    const waterQualityScore = totalWaterQuality;

    let weightedImpactScore =
      (biodiversityScore * weights.biodiversity) +
      (carbonScore * weights.carbon) +
      (waterQualityScore * weights.waterQuality);

    // Incorporate cost efficiency (higher score for lower cost)
    // A scaling factor of 10000 is used to make the 1/totalCost term more impactful
    if (totalCost > 0) {
      weightedImpactScore += (1 / totalCost) * weights.costEfficiency * 10000;
    }

    // Incorporate risk tolerance (higher score for lower risk, assuming 0-100 risk scale)
    weightedImpactScore += ((100 - averageRisk) * weights.riskTolerance);

    return {
      totalCost,
      weightedImpactScore,
      averageRisk,
      biodiversityScore,
      carbonScore,
      waterQualityScore,
    };
  }

  /**
   * Finds an optimal portfolio given a budget and weights using a greedy approach.
   * This is a placeholder for a more complex optimization algorithm.
   * Projects are sorted by a simplified impact-to-cost ratio and added greedily.
   * @param maxBudget - The maximum budget available.
   * @param weights - Weights for different ecological and financial criteria.
   * @returns A tuple of [optimalProjectIds, portfolioEvaluation].
   */
  findOptimalPortfolio(
    maxBudget: number,
    weights: PortfolioWeights
  ): { projectIds: string[]; evaluation: PortfolioEvaluation } {
    const projectsWithinBudget = this.projects
      .filter(p => p.cost <= maxBudget) // Filter out projects too expensive on their own
      .sort((a, b) => {
        // Calculate a simplified impact for sorting
        const impactA =
          (a.expectedBiodiversityIncrease * weights.biodiversity) +
          (a.expectedCarbonSequestration * weights.carbon) +
          (a.expectedWaterQualityImprovement * weights.waterQuality);
        const impactB =
          (b.expectedBiodiversityIncrease * weights.biodiversity) +
          (b.expectedCarbonSequestration * weights.carbon) +
          (b.expectedWaterQualityImprovement * weights.waterQuality);

        // Use a ratio to prioritize projects that give more 'bang for buck'
        const ratioA = a.cost > 0 ? impactA / a.cost : Infinity;
        const ratioB = b.cost > 0 ? impactB / b.cost : Infinity;
        return ratioB - ratioA; // Sort descending by impact/cost ratio
      });

    let currentCost = 0;
    const selectedProjectIds: string[] = [];

    for (const project of projectsWithinBudget) {
      if (currentCost + project.cost <= maxBudget) {
        selectedProjectIds.push(project.id);
        currentCost += project.cost;
      }
    }

    const evaluation = this.evaluatePortfolio(selectedProjectIds, weights, maxBudget);

    return { projectIds: selectedProjectIds, evaluation };
  }
}

// 07-demos/eco-stratege/src/core/models.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { EcoProject, PortfolioWeights, EcoStrategist } from './models';

describe('EcoStrategist', () => {
  let strategist: EcoStrategist;
  let projects: EcoProject[];

  beforeEach(() => {
    projects = [
      {
        id: 'proj-wetland-1',
        name: 'Wetland Restoration A',
        cost: 100000,
        expectedBiodiversityIncrease: 80,
        expectedCarbonSequestration: 500,
        expectedWaterQualityImprovement: 90,
        riskFactor: 20,
        durationYears: 5,
      },
      {
        id: 'proj-forest-2',
        name: 'Forest Reforestation B',
        cost: 150000,
        expectedBiodiversityIncrease: 70,
        expectedCarbonSequestration: 1200,
        expectedWaterQualityImprovement: 60,
        riskFactor: 30,
        durationYears: 10,
      },
      {
        id: 'proj-river-3',
        name: 'River Bank Stabilization C',
        cost: 50000,
        expectedBiodiversityIncrease: 60,
        expectedCarbonSequestration: 100,
        expectedWaterQualityImprovement: 80,
        riskFactor: 10,
        durationYears: 3,
      },
      {
        id: 'proj-invasive-4',
        name: 'Invasive Species Removal D',
        cost: 30000,
        expectedBiodiversityIncrease: 40,
        expectedCarbonSequestration: 50,
        expectedWaterQualityImprovement: 20,
        riskFactor: 5,
        durationYears: 2,
      },
      {
        id: 'proj-urban-5',
        name: 'Urban Green Space E',
        cost: 200000,
        expectedBiodiversityIncrease: 90,
        expectedCarbonSequestration: 300,
        expectedWaterQualityImprovement: 70,
        riskFactor: 40,
        durationYears: 7,
      },
    ];
    strategist = new EcoStrategist(projects);
  });

  it('should add projects correctly', () => {
    const newProject: EcoProject = {
      id: 'proj-new-6',
      name: 'New Park F',
      cost: 75000,
      expectedBiodiversityIncrease: 50,
      expectedCarbonSequestration: 200,
      expectedWaterQualityImprovement: 40,
      riskFactor: 15,
      durationYears: 4,
    };
    strategist.addProject(newProject);
    expect(strategist.getProject('proj-new-6')).toEqual(newProject);
  });

  it('should throw an error if adding a project with duplicate ID', () => {
    const duplicateProject: EcoProject = {
      id: 'proj-wetland-1',
      name: 'Duplicate Project',
      cost: 1,
      expectedBiodiversityIncrease: 1,
      expectedCarbonSequestration: 1,
      expectedWaterQualityImprovement: 1,
      riskFactor: 1,
      durationYears: 1,
    };
    expect(() => strategist.addProject(duplicateProject)).toThrow('Project with ID proj-wetland-1 already exists.');
  });

  it('should evaluate an empty portfolio correctly', () => {
    const weights: PortfolioWeights = {
      biodiversity: 1, carbon: 1, waterQuality: 1, costEfficiency: 1, riskTolerance: 1
    };
    const evaluation = strategist.evaluatePortfolio([], weights);
    expect(evaluation.totalCost).toBe(0);
    expect(evaluation.weightedImpactScore).toBe(0);
    expect(evaluation.averageRisk).toBe(0);
  });

  it('should evaluate a single project portfolio', () => {
    const weights: PortfolioWeights = {
      biodiversity: 1, carbon: 0.5, waterQuality: 0.8, costEfficiency: 0, riskTolerance: 0
    };
    const evaluation = strategist.evaluatePortfolio(['proj-wetland-1'], weights);
    expect(evaluation.totalCost).toBe(100000);
    expect(evaluation.biodiversityScore).toBe(80);
    expect(evaluation.carbonScore).toBe(500);
    expect(evaluation.waterQualityScore).toBe(90);
    expect(evaluation.averageRisk).toBe(20);
    // Weighted impact: (80*1) + (500*0.5) + (90*0.8) = 80 + 250 + 72 = 402
    expect(evaluation.weightedImpactScore).toBe(402);
  });

  it('should evaluate a multi-project portfolio with weights', () => {
    const weights: PortfolioWeights = {
      biodiversity: 2, carbon: 1, waterQuality: 1.5, costEfficiency: 0, riskTolerance: 0
    };
    const evaluation = strategist.evaluatePortfolio(['proj-wetland-1', 'proj-river-3'], weights);

    // proj-wetland-1: cost=100k, bio=80, carbon=500, water=90, risk=20
    // proj-river-3: cost=50k, bio=60, carbon=100, water=80, risk=10
    // Total Cost: 150000
    // Total Bio: 80+60 = 140
    // Total Carbon: 500+100 = 600
    // Total Water: 90+80 = 170
    // Average Risk: (20+10)/2 = 15

    expect(evaluation.totalCost).toBe(150000);
    expect(evaluation.biodiversityScore).toBe(140);
    expect(evaluation.carbonScore).toBe(600);
    expect(evaluation.waterQualityScore).toBe(170);
    expect(evaluation.averageRisk).toBe(15);
    // Weighted impact: (140*2) + (600*1) + (170*1.5) = 280 + 600 + 255 = 1135
    expect(evaluation.weightedImpactScore).toBe(1135);
  });

  it('should incorporate cost efficiency and risk tolerance into weighted impact score', () => {
    const weightsWithEfficiencyAndRisk: PortfolioWeights = {
      biodiversity: 1, carbon: 1, waterQuality: 1, costEfficiency: 500, riskTolerance: 1
    };
    const project = projects[2]; // proj-river-3
    const evaluation = strategist.evaluatePortfolio([project.id], weightsWithEfficiencyAndRisk);

    // Base impact: (60*1) + (100*1) + (80*1) = 240
    // Cost efficiency term: (1 / 50000) * 500 * 10000 = 100
    // Risk tolerance term: (100 - project.riskFactor) * weights.riskTolerance = (100 - 10) * 1 = 90
    // Total weighted impact: 240 + 100 + 90 = 430
    expect(evaluation.weightedImpactScore).toBeCloseTo(430);
  });

  it('should find an optimal portfolio within budget, prioritizing higher impact/cost ratio', () => {
    const maxBudget = 200000;
    const weights: PortfolioWeights = {
      biodiversity: 1, carbon: 0.5, waterQuality: 0.8, costEfficiency: 0, riskTolerance: 0
    };

    // Expected optimal projects based on greedy selection by impact/cost ratio:
    // proj-forest-2 (cost 150k, impact 718, ratio ~0.004786)
    // proj-river-3 (cost 50k, impact 174, ratio ~0.00348)
    // Total cost: 150k + 50k = 200k
    // Total impact: 718 + 174 = 892

    const { projectIds, evaluation } = strategist.findOptimalPortfolio(maxBudget, weights);

    expect(projectIds).toEqual(['proj-forest-2', 'proj-river-3']); 
    expect(evaluation.totalCost).toBe(200000);
    expect(evaluation.weightedImpactScore).toBe(892);
  });

  it('should find an optimal portfolio that respects budget limits strictly', () => {
    const maxBudget = 120000; 
    const weights: PortfolioWeights = {
      biodiversity: 1, carbon: 0.5, waterQuality: 0.8, costEfficiency: 0, riskTolerance: 0
    };

    // Expected optimal projects based on greedy selection by impact/cost ratio:
    // proj-forest-2 (cost 150k) - too expensive alone
    // proj-wetland-1 (cost 100k, impact 402, ratio ~0.00402) - fits, 20k remaining, no other project fits

    const { projectIds, evaluation } = strategist.findOptimalPortfolio(maxBudget, weights);

    expect(projectIds).toEqual(['proj-wetland-1']);
    expect(evaluation.totalCost).toBe(100000);
    expect(evaluation.weightedImpactScore).toBe(402);
  });
});