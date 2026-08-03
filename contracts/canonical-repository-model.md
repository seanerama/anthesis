# Contract: canonical-repository-model

- **Status:** frozen v1
- **Owner:** `analysis/canonical-model`

## Exposes

Versioned JSON emitted by `anthesis analyze <repository> --output analysis.json` and
consumed by botanical interpretation. It records Git facts and classification, not
rendering decisions or normalized botanical geometry.

## Consumes

Local Git object and diff data plus analysis configuration. Version 1 supports
`git-only` mode; forge enrichment is intentionally outside this contract.

## Schema / wire

All timestamps are UTC RFC 3339 strings. Object arrays are emitted in the stated
stable sort order. SHA values are full lowercase object IDs.

```ts
type CanonicalRepositoryV1 = {
  schemaVersion: 1;
  repository: {
    identity: string;       // canonical local path or configured owner/name
    defaultBranch: string;
    snapshotSha: string;
  };
  analysis: {
    mode: "git-only";
    generatedAt: string;    // informational; excluded from structural seed
    configHash: string;     // lowercase SHA-256
    exclusions: string[];
  };
  period: { start: string; end: string };
  contributors: Array<{
    id: string;
    displayName: string;
    aliases: string[];
  }>;                       // sorted by id
  commits: Array<{
    sha: string;
    parentShas: string[];
    authorId: string;
    authoredAt: string;
    additions: number;
    deletions: number;
    filesChanged: number;
    testChanges: number;
    documentationChanges: number;
    excludedChanges: number;
    isMerge: boolean;
    isRevert: boolean;
  }>;                       // authoredAt ascending, then sha
  tags: Array<{
    name: string;
    targetSha: string;
    occurredAt: string;
  }>;                       // occurredAt ascending, then name
  warnings: Array<{
    code: string;
    message: string;
    sourceSha?: string;
  }>;
};
```

Unknown facts are omitted only where a property is explicitly optional. Counts are
non-negative integers. Validation failure is fatal and produces no output artifact.

## Versioning

Frozen at **v1**. Changes are **additive only** — a breaking change is a NEW
contract, not an edit (framework-spec §4.3). Every consumer depends on this shape.
