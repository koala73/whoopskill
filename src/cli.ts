import { Command } from 'commander';
import { login, logout, status as authStatus } from './auth/oauth.js';
import { fetchData, fetchAllTypes } from './api/client.js';
import { getWhoopDay, validateISODate } from './utils/date.js';
import { handleError, WhoopError, ExitCode } from './utils/errors.js';
import { formatPretty, formatSummary } from './utils/format.js';
import type { DataType, WhoopData } from './types/whoop.js';

const program = new Command();

function output(data: WhoopData, pretty: boolean): void {
  console.log(pretty ? formatPretty(data) : JSON.stringify(data, null, 2));
}

program
  .name('whoopskill')
  .description('CLI for fetching WHOOP health data')
  .version('1.0.0');

program
  .command('auth')
  .description('Manage authentication')
  .argument('<action>', 'login, logout, or status')
  .action(async (action: string) => {
    try {
      switch (action) {
        case 'login':
          await login();
          break;
        case 'logout':
          logout();
          break;
        case 'status':
          authStatus();
          break;
        default:
          throw new WhoopError(`Unknown auth action: ${action}`, ExitCode.GENERAL_ERROR);
      }
    } catch (error) {
      handleError(error);
    }
  });

function addDataCommand(name: string, description: string, dataType: DataType): void {
  program
    .command(name)
    .description(description)
    .option('-d, --date <date>', 'Date in ISO format (YYYY-MM-DD)')
    .option('-s, --start <date>', 'Start date for range query')
    .option('-e, --end <date>', 'End date for range query')
    .option('-l, --limit <number>', 'Max results per page', '25')
    .option('-a, --all', 'Fetch all pages')
    .option('-p, --pretty', 'Human-readable output')
    .action(async (options) => {
      try {
        const date = options.date || getWhoopDay();
        if (options.date && !validateISODate(options.date)) {
          throw new WhoopError('Invalid date format. Use YYYY-MM-DD', ExitCode.GENERAL_ERROR);
        }

        const result = await fetchData([dataType], date, {
          limit: parseInt(options.limit, 10),
          all: options.all,
        });

        output(result, options.pretty);
      } catch (error) {
        handleError(error);
      }
    });
}

addDataCommand('sleep', 'Get sleep data', 'sleep');
addDataCommand('recovery', 'Get recovery data', 'recovery');
addDataCommand('workout', 'Get workout data', 'workout');
addDataCommand('cycle', 'Get cycle data', 'cycle');
addDataCommand('profile', 'Get profile data', 'profile');
addDataCommand('body', 'Get body measurements', 'body');

program
  .command('summary')
  .description('One-liner health snapshot')
  .option('-d, --date <date>', 'Date in ISO format (YYYY-MM-DD)')
  .action(async (options) => {
    try {
      const date = options.date || getWhoopDay();
      if (options.date && !validateISODate(options.date)) {
        throw new WhoopError('Invalid date format. Use YYYY-MM-DD', ExitCode.GENERAL_ERROR);
      }

      const result = await fetchData(['recovery', 'sleep', 'cycle', 'workout'], date, { limit: 25 });
      console.log(formatSummary(result));
    } catch (error) {
      handleError(error);
    }
  });

program
  .option('-d, --date <date>', 'Date in ISO format (YYYY-MM-DD)')
  .option('-l, --limit <number>', 'Max results per page', '25')
  .option('-a, --all', 'Fetch all pages')
  .option('-p, --pretty', 'Human-readable output')
  .option('--sleep', 'Include sleep data')
  .option('--recovery', 'Include recovery data')
  .option('--workout', 'Include workout data')
  .option('--cycle', 'Include cycle data')
  .option('--profile', 'Include profile data')
  .option('--body', 'Include body measurements')
  .action(async (options) => {
    try {
      const date = options.date || getWhoopDay();
      if (options.date && !validateISODate(options.date)) {
        throw new WhoopError('Invalid date format. Use YYYY-MM-DD', ExitCode.GENERAL_ERROR);
      }

      const types: DataType[] = [];
      if (options.sleep) types.push('sleep');
      if (options.recovery) types.push('recovery');
      if (options.workout) types.push('workout');
      if (options.cycle) types.push('cycle');
      if (options.profile) types.push('profile');
      if (options.body) types.push('body');

      const fetchOptions = {
        limit: parseInt(options.limit, 10),
        all: options.all,
      };

      const result =
        types.length > 0
          ? await fetchData(types, date, fetchOptions)
          : await fetchAllTypes(date, fetchOptions);

      output(result, options.pretty);
    } catch (error) {
      handleError(error);
    }
  });

export { program };
