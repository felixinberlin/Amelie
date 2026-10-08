# Specification: Sample Deterministic State Engine (`sample-feature`)

**Status:** Active  
**Author:** Zero-Drift Swarm Builder  
**Last Verified:** 2026-09-28  

---

## 1. Purpose & Requirements
The `sample-feature` engine provides a deterministic, zero-hallucination state machine for managing task states in an autonomous pipeline.

## 2. Invariants
- Allowed States: `idle`, `researching`, `reviewing`, `building`, `verified`, `failed`.
- Any transition not explicitly listed in the state transition table must throw a `StateTransitionError`.
- State transitions must emit a timestamped audit log.
