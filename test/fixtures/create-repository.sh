#!/usr/bin/env bash
set -euo pipefail
target="${1:?fixture path required}"
rm -rf "$target"
git init -q -b main "$target"
git -C "$target" config user.name "Ada Gardener"
git -C "$target" config user.email "ada@example.test"
printf 'seed\n' > "$target/garden.txt"
git -C "$target" add garden.txt
GIT_AUTHOR_DATE=2024-01-01T12:00:00Z GIT_COMMITTER_DATE=2024-01-01T12:00:00Z git -C "$target" commit -q -m "Plant seed"
printf 'bloom\n' >> "$target/garden.txt"
git -C "$target" add garden.txt
GIT_AUTHOR_DATE=2024-02-01T12:00:00Z GIT_COMMITTER_DATE=2024-02-01T12:00:00Z git -C "$target" commit -q -m "Grow bloom"
GIT_COMMITTER_DATE=2024-02-01T12:00:00Z git -C "$target" tag -a v1.0.0 -m "First bloom"
