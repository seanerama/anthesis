# Stage 4 observable CLI smoke

The v2 analysis slice is dark-launched and has no viewer surface. Its observable
smoke is an explicit CLI artifact check:

```bash
npm run smoke:analysis-v2
```

This builds Anthesis, creates a temporary real Git fixture, invokes `anthesis
analyze --grammar botanical-v2`, parses the resulting canonical JSON, and checks
that it contains schema version 2, at least one development episode, and the
explicit `noOverallScore` phenotype invariant. Omitting `--grammar botanical-v2`
continues to emit the byte-compatible canonical v1 artifact.
