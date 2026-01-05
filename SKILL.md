---
name: whoopskill
description: WHOOP CLI for fetching health data (sleep, recovery, workouts, HRV, strain).
homepage: https://github.com/eliehabib/whoopskill
metadata: {"clawdis":{"emoji":"💪","requires":{"bins":["node"],"env":["WHOOP_CLIENT_ID","WHOOP_CLIENT_SECRET","WHOOP_REDIRECT_URI"]},"install":[{"id":"npm","kind":"npm","package":"whoopskill","bins":["whoopskill"],"label":"Install whoopskill (npm)"}]}}
---

# whoopskill

Use `whoopskill` to fetch WHOOP health metrics (sleep, recovery, HRV, strain, workouts).

Quick start
- `npx whoopskill` — fetch all today's data
- `npx whoopskill recovery` — recovery score, HRV, RHR
- `npx whoopskill sleep` — sleep performance, stages
- `npx whoopskill workout` — workouts with strain
- `npx whoopskill --date 2025-01-03` — specific date

Data types
- `profile` — user info (name, email)
- `body` — height, weight, max HR
- `sleep` — sleep stages, efficiency, respiratory rate
- `recovery` — recovery %, HRV, RHR, SpO2, skin temp
- `workout` — strain, HR zones, calories
- `cycle` — daily strain, calories

Combine types
- `npx whoopskill --sleep --recovery --body`

Auth
- `npx whoopskill auth login` — OAuth flow (paste callback URL)
- `npx whoopskill auth status` — check token status
- `npx whoopskill auth logout` — clear tokens

Notes
- Output is JSON to stdout
- Tokens stored in `~/.whoop-cli/tokens.json` (auto-refresh)
- Uses WHOOP API v2
- Date follows WHOOP day boundary (4am cutoff)
