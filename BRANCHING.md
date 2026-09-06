# Branching Strategy

This document defines how branches, commits, and releases work in this repository. It is built around **trunk-based development** with two long-lived branches (`staging`, `main`), Conventional Commits, and automated versioning via `semantic-release`.

## Why this model

`semantic-release` computes the next version number from commit history, so it requires a clean, linear, meaningful commit log on every releasing branch. Long-lived `develop`/`release` branches (Git-flow) fight this assumption by accumulating merge noise and delaying when commits reach a releasing branch. This strategy keeps history simple: short-lived feature branches, two releasing branches, one direction of promotion.

## Branches

| Branch                                                                   | Purpose                        | Deploys to | Release type                   | Long-lived?             |
| ------------------------------------------------------------------------ | ------------------------------ | ---------- | ------------------------------ | ----------------------- |
| `main`                                                                   | Source of truth for production | Production | Stable (`1.4.0`)               | Yes                     |
| `staging`                                                                | Integration and QA             | Staging    | Prerelease (`1.4.0-staging.1`) | Yes                     |
| `feat/*`, `fix/*`, `chore/*`, `refactor/*`, `docs/*`, `perf/*`, `test/*` | Individual units of work       | None       | None                           | No — delete after merge |

Feature branches are created off `staging` and merged back into `staging`. Nothing is ever branched directly off `main` except hotfixes (see below).

### Naming feature branches

Prefix matches the Conventional Commit type the branch will primarily produce:

```
feat/user-avatar-upload
fix/staging-cors-header
chore/upgrade-angular-22
refactor/signal-store-cleanup
docs/branching-strategy
```

Keep them short-lived — days, not weeks. If a feature branch is going to outlive a sprint, break it into smaller PRs.

## Commit messages

All commits must follow [Conventional Commits](https://www.conventionalcommits.org/). This is enforced two ways:

1. **Locally**: a `commit-msg` Husky hook runs `commitlint` on every commit. A non-conforming commit is rejected before it's created.
2. **In CI**: the `commitlint` job in `pull_request.yml` re-validates every commit in a PR, so the rule can't be bypassed with `--no-verify`.

### Writing a commit

Use the interactive prompt instead of writing the message by hand:

```bash
npm run commit
```

This runs `git-cz` (`cz-conventional-changelog`) and walks you through type, scope, description, breaking changes, and issue references.

### Commit types and their release effect

| Type                                                                        | Meaning                       | Version bump                          |
| --------------------------------------------------------------------------- | ----------------------------- | ------------------------------------- |
| `fix:`                                                                      | Bug fix                       | patch (`1.2.3` → `1.2.4`)             |
| `feat:`                                                                     | New feature                   | minor (`1.2.3` → `1.3.0`)             |
| `feat!:` or `BREAKING CHANGE:` in footer                                    | Breaking change               | major (`1.2.3` → `2.0.0`)             |
| `chore:`, `docs:`, `style:`, `refactor:`, `test:`, `perf:`, `ci:`, `build:` | No user-facing release impact | none (unless combined with the above) |

`refactor:` and `perf:` produce no version bump by default. If a refactor changes public behavior, it should be `fix:` or `feat:` instead.

## Day-to-day workflow

### 1. Start a feature

```bash
git checkout staging
git pull origin staging
git checkout -b feat/user-avatar-upload
```

### 2. Commit work

```bash
git add .
npm run commit
```

Repeat as needed. Small, focused commits are preferred — `commit-analyzer` reads every commit on the branch once it lands on `staging`/`main`, but PR review reads them too, so keep them meaningful.

### 3. Open a PR into `staging`

```bash
git push -u origin feat/user-avatar-upload
gh pr create --base staging --title "feat: add user avatar upload"
```

PR title must also be a valid Conventional Commit — it becomes the squash commit message.

CI runs on the PR (`pull_request.yml`):

- `commitlint` — validates commit messages
- `eslint` — lint
- `angular` build
- `vitest` — unit tests

All four must pass before merge.

### 4. Merge into `staging`

**Squash merge.** One feature = one commit on `staging`. Use the PR title (already Conventional-Commit-formatted) as the squash commit message.

Merging triggers `staging.yml`:

- build → test → `semantic-release`
- `semantic-release` computes a prerelease version (e.g. `1.4.0-staging.3`), tags it, publishes a GitHub release on the `staging` channel, and (via your deploy pipeline) ships it to the staging environment.

### 5. QA on staging

Verify the feature in the staging environment. Fix forward with more `feat/*`/`fix/*` branches into `staging` if issues are found — do not touch `main` yet.

### 6. Promote `staging` → `main`

When staging is verified and ready for release:

```bash
gh pr create --base main --head staging --title "release: promote staging to main"
```

**Do not squash this merge.** Use a regular merge commit (`--no-ff`) or fast-forward, preserving every individual commit that went into `staging`. This is the one hard rule that keeps releases correct:

> Squashing the `staging` → `main` PR collapses all commit types into one, so `semantic-release` can no longer tell whether the release should be a patch, minor, or major. Always use "Create a merge commit" for this specific PR, never "Squash and merge."

Merging triggers `main.yml`:

- build → test → `semantic-release`
- `semantic-release` computes the stable version (e.g. `1.4.0`), tags it, generates/updates `CHANGELOG.md`, publishes a GitHub release, and ships to production.

### 7. Hotfixes

A hotfix is a fix that must reach production before the next normal `staging` → `main` promotion.

```bash
git checkout main
git pull origin main
git checkout -b fix/critical-login-crash
# fix, commit with npm run commit
gh pr create --base main --title "fix: critical login crash"
```

Merge (squash) directly into `main`. `main.yml` releases the patch to production immediately.

**Afterward, back-merge `main` into `staging`** so staging doesn't drift and later PRs don't reintroduce the bug or conflict:

```bash
git checkout staging
git pull origin staging
git merge main
git push origin staging
```

## Branch protection rules (configure in GitHub repo settings)

Repo → **Settings → Branches → Branch protection rules → Add rule** (or **Rulesets** on newer GitHub UI). Create one rule per branch below.

### Repo-level merge button settings

**Settings → General → Pull Requests:**

- ✅ Allow squash merging
- ✅ Allow merge commits
- ⬜ Allow rebase merging (optional — not required by this strategy)
- ✅ Automatically delete head branches (cleans up `feat/*`/`fix/*`/etc. after merge)

This is the superset — every method must be enabled here for any of them to be selectable at all. Each branch protection rule below then narrows "Allowed merge methods" down to exactly one, per target branch.

### `main`

**Branch name pattern:** `main`

- ✅ Require a pull request before merging
  - ✅ Require approvals — at least `1`
  - ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date before merging
  - Required checks (must match the **exact** context GitHub reports — reusable workflows report as `<caller workflow name> / <job> / <inner job> (<matrix>)`, not the bare caller job name):
    - `Lint, Build & Test on Pull Request / commitlint (pull_request)`
    - `Lint, Build & Test on Pull Request / eslint / lint (22.x) (pull_request)`
    - `Lint, Build & Test on Pull Request / angular / build (22.x) (pull_request)`
    - `Lint, Build & Test on Pull Request / vitest / unit-test (22.x) (pull_request)`
- ✅ Require conversation resolution before merging
- ✅ Do not allow bypassing the above settings (applies rules to admins too)
- **Allowed merge methods:** `Merge` only (uncheck Squash and Rebase) — hard-blocks history-flattening on the `staging` → `main` promotion PR at the GitHub UI level, no procedural discipline needed
- ⬜ Allow force pushes — leave unchecked
- ⬜ Allow deletions — leave unchecked

> `main.yml`'s `semantic-release` job pushes the version bump/tag directly to `main` after merge — this rule's "Do not allow bypassing" blocks that unless the push uses a token belonging to an actor exempted from the rule (see `semantic-release` push permissions note below `staging`).

### `staging`

**Branch name pattern:** `staging`

- ✅ Require a pull request before merging
  - ✅ Require approvals — at least `1`
  - ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date before merging
  - Required checks (must match the **exact** context GitHub reports — reusable workflows report as `<caller workflow name> / <job> / <inner job> (<matrix>)`, not the bare caller job name):
    - `commitlint`
    - `eslint / lint (24.x)`
    - `angular / build (24.x)`
    - `vitest / unit-test (24.x)`
- ✅ Require conversation resolution before merging
- **Allowed merge methods:** `Squash` only (uncheck Merge and Rebase) — keeps one feature = one commit on `staging`
- ⬜ Allow force pushes — leave unchecked
- ⬜ Allow deletions — leave unchecked

> **`semantic-release` push vs branch protection — resolved via Ruleset bypass + PAT:**
>
> Both `main` and `staging` use **Rulesets** (Settings → Rules → Rulesets), not classic branch protection. The `semantic-release` job pushes a version-bump/`CHANGELOG.md` commit and tag directly to the protected branch after merge — this is rejected (`GH013: Repository rule violations`) by the default `GITHUB_TOKEN`, which cannot be added to a bypass list (no `GitHub Actions` entry under the ruleset's **Apps** bypass tab on this repo).
>
> Fix in place:
>
> 1. Each ruleset's **Bypass list → Roles** has `Repository admin` checked.
> 2. A fine-grained PAT (repo-scoped to `noetic`, `Contents: Read and write`) was generated on an admin account and stored as the `RELEASE_TOKEN` repo secret.
> 3. `khumozin/workflow-templates`'s `nodejs-semantic-release.yml` was patched (tag `1.11.0`+) to accept a `secrets.release_token` input, used for both the `actions/checkout` token (this is what the git push actually authenticates with) and the `GITHUB_TOKEN` env var passed to `npx semantic-release` (used for the GitHub Releases API call).
> 4. `staging.yml`/`main.yml` pin `nodejs-semantic-release.yml@1.11.0` and pass `secrets: { release_token: ${{ secrets.RELEASE_TOKEN }} }` on the `semantic-release` job.
>
> Rotate `RELEASE_TOKEN` before it expires (fine-grained PATs have a hard expiry) — an expired token fails release pushes the same way the original bug did, just later.

## semantic-release configuration reference

Located in `package.json` under `"release"`:

```json
"release": {
  "branches": [
    "main",
    { "name": "staging", "channel": "staging", "prerelease": true }
  ],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    ["@semantic-release/git", { "assets": ["package.json", "package-lock.json", "CHANGELOG.md"] }],
    "@semantic-release/github"
  ]
}
```

- `main` → stable channel (`latest` tag on GitHub releases, versions like `1.4.0`)
- `staging` → `staging` channel, prerelease versions (`1.4.0-staging.1`, `.2`, `.3`...)

## Quick reference

```
feat/*, fix/*, chore/*  ──PR (squash)──▶  staging  ──PR (merge commit, no squash)──▶  main
                                            │                                          │
                                       semantic-release                          semantic-release
                                       (prerelease)                              (stable)
                                            │                                          │
                                            ▼                                          ▼
                                        staging env                              production env

fix/* (hotfix)  ──PR (squash)──▶  main  ──back-merge──▶  staging
```

## FAQ

**Can I branch a feature directly off `main`?**
No, except hotfixes. All normal feature work branches off `staging`.

**What if I need a long-running experimental branch?**
Keep it off both `staging` and `main`, rebase it onto `staging` regularly, and only open the PR into `staging` when it's ready to integrate. Long-lived branches that aren't `staging`/`main` should not be relied upon for CI or releases.

**What happens if I forget to use `npm run commit` and write a raw `git commit -m "..."`?**
The `commit-msg` hook still validates it — if the message isn't a valid Conventional Commit, the commit is rejected. Fix the message and re-commit.

**What if `commitlint` fails in CI but passed locally?**
Usually means someone bypassed the hook (`--no-verify`) or a commit was authored outside this checkout (e.g. GitHub web UI merge commit). Amend the offending commit or, if it's already merged, it only matters going forward — CI failing on a PR blocks that PR, not history already on `staging`/`main`.
