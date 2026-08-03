# Stage 5 CLI smoke

Run `npm run smoke:botanical-v2`. The smoke grows the checked-in six-episode
analysis twice through the default-off `grow --grammar botanical-v2` path. It
asserts byte-identical botanical JSON, matching semantic fingerprints, roots,
branches, leaves, sepals, rings, petals, florets, and one to three blooms/buds.
The ordinary `grow` command remains the legacy grammar by default.
