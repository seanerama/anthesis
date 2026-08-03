#!/usr/bin/env bash
set -euo pipefail
root="${1:?fixture root required}"
mkdir -p "$root"
commit_file() {
  local repo="$1" file="$2" content="$3" message="$4" date="$5" name="${6:-Ada Gardener}" email="${7:-ada@example.test}"
  mkdir -p "$(dirname "$repo/$file")"; printf '%s\n' "$content" > "$repo/$file"; git -C "$repo" add .
  GIT_AUTHOR_NAME="$name" GIT_AUTHOR_EMAIL="$email" GIT_COMMITTER_NAME="$name" GIT_COMMITTER_EMAIL="$email" GIT_AUTHOR_DATE="$date" GIT_COMMITTER_DATE="$date" git -C "$repo" commit -q -m "$message"
}
init_repo() { git init -q -b main "$1"; git -C "$1" config user.name "Fixture Gardener"; git -C "$1" config user.email "fixture@example.test"; }
for shape in steady-growth collaborative-release major-refactor chaotic-experimentation documentation-heavy; do target="$root/$shape"; rm -rf "$target"; init_repo "$target"; done
steady="$root/steady-growth"; commit_file "$steady" src/garden.ts seed seed 2024-01-01T00:00:00Z; commit_file "$steady" src/garden.ts bloom grow 2024-02-01T00:00:00Z; GIT_COMMITTER_DATE=2024-02-01T00:00:00Z git -C "$steady" tag -a v1 -m v1
collab="$root/collaborative-release"; commit_file "$collab" src/app.ts base base 2024-01-01T00:00:00Z; git -C "$collab" checkout -q -b feature; commit_file "$collab" src/feature.ts feature feature 2024-01-02T00:00:00Z "Bo Bloom" bo@example.test; git -C "$collab" checkout -q main; GIT_AUTHOR_DATE=2024-01-03T00:00:00Z GIT_COMMITTER_DATE=2024-01-03T00:00:00Z git -C "$collab" merge -q --no-ff feature -m merge; GIT_COMMITTER_DATE=2024-01-03T00:00:00Z git -C "$collab" tag -a v1 -m v1
refactor="$root/major-refactor"; commit_file "$refactor" src/large.ts "one two three four five" base 2024-01-01T00:00:00Z; commit_file "$refactor" src/large.ts one refactor 2024-02-01T00:00:00Z; commit_file "$refactor" test/refactor.test.ts covered tests 2024-02-02T00:00:00Z
chaos="$root/chaotic-experimentation"; commit_file "$chaos" src/idea.ts idea idea 2024-01-01T00:00:00Z; commit_file "$chaos" src/idea.ts changed experiment 2024-04-01T00:00:00Z; GIT_AUTHOR_DATE=2024-04-02T00:00:00Z GIT_COMMITTER_DATE=2024-04-02T00:00:00Z git -C "$chaos" revert --no-edit HEAD
docs="$root/documentation-heavy"; commit_file "$docs" src/app.ts app app 2024-01-01T00:00:00Z; commit_file "$docs" docs/guide.md guide docs 2024-01-15T00:00:00Z; commit_file "$docs" README.md readme readme 2024-02-01T00:00:00Z; GIT_COMMITTER_DATE=2024-02-01T00:00:00Z git -C "$docs" tag -a v1 -m v1
