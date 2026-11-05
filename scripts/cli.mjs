#!/usr/bin/env node

const baseUrl = (process.env.FLAGS_API_URL ?? 'http://localhost:3000')
  .replace(/\/+$/, '');

function usage() {
  console.log(`Usage:
  ./flags-cli.mjs list
  ./flags-cli.mjs get <id>
  ./flags-cli.mjs create <name> <true|false> [type]
  ./flags-cli.mjs update <id> <true|false>

Environment:
  FLAGS_API_URL  API base URL (default: http://localhost:3000)`);
}

function parseBoolean(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error(`Expected "true" or "false", got "${value}"`);
}

async function api(method, path, body) {
  const response = await fetch(`${baseUrl}/flags${path}`, {
    method,
    headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await response.text();
  let result;

  try {
    result = text ? JSON.parse(text) : undefined;
  } catch {
    result = text;
  }

  if (!response.ok) {
    const message =
      typeof result === 'object' && result !== null
        ? JSON.stringify(result)
        : result || response.statusText;

    throw new Error(`HTTP ${response.status}: ${message}`);
  }

  return result;
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  let result;

  switch (command) {
    case 'list':
      if (args.length !== 0) break;
      result = await api('GET', '');
      break;

    case 'get':
      if (args.length !== 1) break;
      result = await api('GET', `/${encodeURIComponent(args[0])}`);
      break;

    case 'create':
      if (args.length < 2 || args.length > 3) break;
      result = await api('POST', '', {
        name: args[0],
        type: args[2] ?? 'boolean',
        value: parseBoolean(args[1]),
      });
      break;

    case 'update':
      if (args.length !== 2) break;
      result = await api(
        'PATCH',
        `/${encodeURIComponent(args[0])}`,
        { value: parseBoolean(args[1]) },
      );
      break;

    default:
      break;
  }

  if (result === undefined) {
    usage();
    process.exitCode = 1;
    return;
  }

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});