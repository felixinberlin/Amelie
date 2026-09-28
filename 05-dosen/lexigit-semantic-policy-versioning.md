# Dossier LexiGit: Semantic Policy Versioning for Public Administration

## Problem Statement
The drafting and maintenance of complex policies, laws, and regulations is a core task for public administrations. Current processes often suffer from a lack of transparency, versioning issues, and difficulties in tracing conceptual changes. Traditional word processing systems only offer simple text diffs, which cannot capture the semantic shift of a paragraph or definition. This leads to errors, inefficiencies, and hinders public participation.

## Solution Approach: LexiGit
LexiGit is a browser-native tool that applies the proven principles of distributed version control (analogous to Git) to the world of policy and legal texts. It is enhanced by locally running AI (WASM/WebGPU) to detect and track not only textual but also *semantic* changes.

### Core Features:
1.  **Git-like Collaboration**: Enables parallel work on texts through branching and merging, analogous to software development workflows.
2.  **Semantic Diffing**: A local AI agent analyzes the difference in meaning between text versions. Instead of just 'word X changed to word Y', it recognizes 'Section 3.2.1 expands its scope from Z to A, with implications for Section 4.1 and 5.3'.
3.  **Semantic Blame**: Visualizes the conceptual origin and evolution of individual clauses or definitions over time. Who introduced the term 'green infrastructure' into this building code and when?
4.  **Policy Impact Analysis**: A local agent can predict potential downstream impacts of proposed changes on other text sections or related documents.
5.  **Interactive History**: A visually appealing timeline or graph shows the evolution of key concepts and policy definitions.

## Amélie Standards Evaluation
*   **Novelty**: The combination of Git-like version control, browser-native, local AI-powered semantic diffing, and its specific application for public administrations is highly novel and distinct from existing DMS solutions.
*   **Complexity**: The core semantic diffing agent is complex, but manageable as a focused micro-tool, fitting Amélie's micro-scaffolding approach.
*   **Possibility**: Advances in WASM/WebGPU LLMs are making such client-side processing increasingly feasible. Data is text-based and well-structured.
*   **Longevity**: The need for transparent and precise policy-making is timeless.
*   **CivicSwot**: Increases transparency, reduces errors, improves collaboration, and fosters public participation through understandable change overviews.
*   **TechTreeFit**: Perfectly aligns with the Amélie philosophy: open-source, browser-native, local AI, focused utility, CC0 license.
*   **GroundTruth**: Addresses a clearly identified need in institutions such as the Senatsverwaltung für Stadtentwicklung, Bauen und Wohnen in Berlin, which deals with complex building and spatial planning laws.
*   **Fun**: The interactive visualization of conceptual evolution and the ability to trace 'semantic responsibilities' offer a high 'VibeCoding' factor and intrinsic motivation for users.

## Target Institution
The **Senatsverwaltung für Stadtentwicklung, Bauen und Wohnen Berlin (Berlin Senate Department for Urban Development, Building and Housing)** would be an ideal first adopter, particularly for managing building codes, urban development plans, and urban planning policies, whose creation processes are complex and often protracted.

## Vitest Snippet
```typescript
// 07-demos/lexigit/test_semantic_diff.ts
import { expect, test } from 'vitest';
import { semanticDiff } from '../src/lexigit-core'; // Assuming core logic is here

test('should identify basic semantic change in policy text', async () => {
  const oldText = 'Section 1: The purpose is to regulate building heights.';
  const newText = 'Section 1: The primary goal is to manage maximum structural heights and aesthetic integration.';
  const diffResult = await semanticDiff(oldText, newText);
  expect(diffResult.hasSemanticChange).toBe(true);
  expect(diffResult.summary).toContain('scope expanded');
  expect(diffResult.affectedConcepts).toEqual(['building heights', 'aesthetic integration']);
});

test('should detect conceptual shift in a definition', async () => {
  const oldDef = '"Green space" means any publicly accessible park or garden.';
  const newDef = '"Green space" encompasses any publicly accessible park, garden, or ecological corridor, promoting biodiversity.';
  const diffResult = await semanticDiff(oldDef, newDef);
  expect(diffResult.hasSemanticChange).toBe(true);
  expect(diffResult.summary).toContain('definition broadened');
  expect(diffResult.newConcepts).toContain('ecological corridor');
  expect(diffResult.impliedImpacts).toContain('biodiversity');
});

test('should handle minor wording changes without major semantic shift', async () => {
  const oldText = 'The committee shall review all proposals thoroughly.';
  const newText = 'The committee will meticulously examine every proposal.';
  const diffResult = await semanticDiff(oldText, newText);
  expect(diffResult.hasSemanticChange).toBe(false);
  expect(diffResult.summary).toContain('minor lexical variation');
});

// Add more tests for branching, merging, blame functionality once implemented
```