Cron example (every 30 minutes):

*/30 * * * * WHOOP_CLIENT_ID=... WHOOP_CLIENT_SECRET=... WHOOP_REDIRECT_URI=... $HOME/.local/bin/whoop-refresh-monitor.sh

Note: `whoopskill auth status` is informational only; cron should run `whoopskill auth refresh` (as this script does).

Tips:
- Run `whoopskill auth login` once interactively to create ~/.whoop-cli/tokens.json
- If refresh token expires, the script will log an ALERT and you must re-login.
