---
name: parallel-agents
description: Run multiple agent tasks in parallel without collisions using git worktrees. Use when the user wants several features/fixes done at once, mentions worktrees, parallel agents, or agents stepping on each other.
---

# parallel-agents

One agent per worktree. No shared checkouts.

## Isolation: worktrees

Never let two agents edit the same checkout. Options in order of preference:

**With [treehouse](https://github.com/kunchenguid/treehouse)** (pooled, reusable worktrees with deps/build-cache intact):

```bash
curl -fsSL https://kunchenguid.github.io/treehouse/install.sh | sh   # once
treehouse            # acquire worktree + subshell; run the agent inside
exit                 # returns worktree to the pool
```

**Plain git** (fallback):

```bash
git worktree add ../<repo>-task-<slug> -b feat/<slug> origin/main
# ... agent works there ...
git worktree remove ../<repo>-task-<slug>   # after merge
```

Rules:

- Each worktree = one task = one branch = one eventual PR.
- Reinstall/verify deps inside the worktree before starting (`pnpm install --frozen-lockfile`, `uv sync`) — don't assume the pool is warm unless treehouse says so.
- Never `git checkout` a branch another worktree has checked out.

## Coordinating multiple tasks

- **Written briefs.** Each parallel task gets a self-contained brief file: goal, constraints, relevant plan (from `plan-feature`), and definition of done. A worker should never need to ask mid-task.
- **Split by boundary, not by layer.** Parallel tasks should touch disjoint files/features; two agents editing the same module will conflict no matter how good the worktrees are. If tasks overlap, serialize them.
- **State on disk.** Track task status in files (e.g. `docs/tasks/<id>.md`), not in a session's memory — any session can be killed and another reconciles from disk.
- **Investigations don't push.** Audit/research tasks end in a report file, never a PR.

## Merge discipline

- Every task's PR goes through the `pr-review` gate independently.
- Rebase on `origin/main` before raising a PR; merge one PR at a time; remaining branches rebase after each merge.
- Conflicts are resolved in the task's worktree, never on main.
