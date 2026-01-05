# whoopskill

CLI for fetching WHOOP health data via the WHOOP API v2.

## Setup

1. Register a WHOOP application at [developer.whoop.com](https://developer.whoop.com)
   - Apps with <10 users don't need WHOOP review (immediate use)

2. Add your redirect URI to the app settings

3. Create `.env` file:
```bash
WHOOP_CLIENT_ID=your_client_id
WHOOP_CLIENT_SECRET=your_client_secret
WHOOP_REDIRECT_URI=https://your-redirect-uri.com/callback
```

4. Install (auto-builds):
```bash
npm install
```

## Authentication

```bash
# Login (opens browser, then paste callback URL)
npx whoopskill auth login

# Check auth status
npx whoopskill auth status

# Logout
npx whoopskill auth logout
```

Tokens are stored in `~/.whoop-cli/tokens.json` and auto-refresh when expired.

## Usage

```bash
# Fetch all today's data
npx whoopskill

# Specific data type
npx whoopskill profile
npx whoopskill body
npx whoopskill sleep
npx whoopskill recovery
npx whoopskill workout
npx whoopskill cycle

# Multiple types
npx whoopskill --sleep --recovery --body

# Specific date (ISO format)
npx whoopskill --date 2025-01-03

# Pagination
npx whoopskill workout --limit 50
npx whoopskill workout --all
```

## Data Types

| Type | Description |
|------|-------------|
| `profile` | User info (name, email) |
| `body` | Body measurements (height, weight, max HR) |
| `sleep` | Sleep records with stages, efficiency, respiratory rate |
| `recovery` | Recovery score, HRV, RHR, SpO2, skin temp |
| `workout` | Workouts with strain, HR zones, calories |
| `cycle` | Daily physiological cycle (strain, calories) |

## Options

| Flag | Description |
|------|-------------|
| `-d, --date <date>` | Date in ISO format (YYYY-MM-DD) |
| `-l, --limit <n>` | Max results per page (default: 25) |
| `-a, --all` | Fetch all pages |
| `--profile` | Include profile |
| `--body` | Include body measurements |
| `--sleep` | Include sleep |
| `--recovery` | Include recovery |
| `--workout` | Include workouts |
| `--cycle` | Include cycle |

## Output

JSON to stdout. Example:
```json
{
  "date": "2025-01-05",
  "fetched_at": "2025-01-05T12:00:00.000Z",
  "profile": { "user_id": 123, "first_name": "John" },
  "body": { "height_meter": 1.83, "weight_kilogram": 82.5, "max_heart_rate": 182 },
  "recovery": [{ "recovery_score": 52, "hrv_rmssd_milli": 38.9 }],
  "sleep": [{ "sleep_performance_percentage": 40 }],
  "workout": [{ "strain": 6.2, "sport_name": "hiit" }],
  "cycle": [{ "strain": 6.7 }]
}
```

## Development

```bash
npm run dev      # Run with tsx
npm run build    # Compile TypeScript
npm start        # Run compiled
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Authentication error |
| 3 | Rate limit exceeded |
| 4 | Network error |

## Requirements

- Node.js 22+
- WHOOP membership with API access
