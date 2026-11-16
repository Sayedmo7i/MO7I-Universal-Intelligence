/**
 * MO7I Universal Intelligence — Command Argument Parser
 * Version: 2.2.0
 * 
 * Safely parses slash command invocations, flags, subcommands, and natural language tasks.
 * Enforces path traversal protection and input sanitization.
 */

const path = require('path');

function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.trim();
}

function checkPathTraversal(targetPath) {
  if (!targetPath || typeof targetPath !== 'string') return false;
  // Disallow obvious directory traversal sequences out of bounds
  const normalized = path.normalize(targetPath);
  if (normalized.startsWith('..') || /\.\.\//.test(targetPath) || /^\/(etc|var|sys|proc|dev)/i.test(normalized)) {
    return true;
  }
  return false;
}

/**
 * Splits an argument string respecting single and double quotes.
 */
function tokenizeArguments(argString) {
  const tokens = [];
  let current = '';
  let inDouble = false;
  let inSingle = false;

  for (let i = 0; i < argString.length; i++) {
    const char = argString[i];
    if (char === '"' && !inSingle) {
      inDouble = !inDouble;
    } else if (char === "'" && !inDouble) {
      inSingle = !inSingle;
    } else if (/\s/.test(char) && !inDouble && !inSingle) {
      if (current.length > 0) {
        tokens.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current.length > 0) {
    tokens.push(current);
  }

  return tokens;
}

/**
 * Parse a raw slash-command or CLI string.
 * Examples:
 *   "/mo7i"
 *   "/mo7i help"
 *   "/mo7i Build a modern Next.js landing page"
 *   "/mo7i audit"
 *   "/setup-project-skills initial --dry-run"
 *   "/mo7i discover nextjs"
 */
function parseCommand(input) {
  const raw = sanitizeInput(input);
  if (!raw) {
    return {
      raw: '',
      command: 'mo7i',
      subcommand: 'help',
      task: null,
      args: [],
      flags: {},
      valid: true,
      error: null
    };
  }

  // Strip leading slash if present
  let cleanInput = raw.startsWith('/') ? raw.slice(1).trim() : raw;
  const tokens = tokenizeArguments(cleanInput);

  if (tokens.length === 0) {
    return {
      raw,
      command: 'mo7i',
      subcommand: 'help',
      task: null,
      args: [],
      flags: {},
      valid: true,
      error: null
    };
  }

  const firstToken = tokens[0].toLowerCase();
  let command = 'mo7i';
  let remainingTokens = tokens.slice(1);

  if (firstToken === 'setup-project-skills' || firstToken === 'mo7i-project-setup') {
    command = 'setup-project-skills';
  } else if (firstToken === 'mo7i') {
    command = 'mo7i';
  } else {
    // If input was e.g. "/audit" or "/learn" or direct prompt without "mo7i" prefix
    const knownSubcommands = ['help', 'setup', 'audit', 'learn', 'discover', 'status', 'doctor', 'update', 'self-update', 'selfupdate', 'selftest'];
    if (knownSubcommands.includes(firstToken)) {
      command = 'mo7i';
      remainingTokens = tokens;
    } else {
      // Natural language prompt treated as /mo7i <prompt>
      command = 'mo7i';
      remainingTokens = tokens;
    }
  }

  // Parse flags and positional args
  const flags = {
    dryRun: false,
    project: null,
    json: false,
    all: false,
    check: false,
    yes: false,
    ref: null,
    source: null
  };

  const positionalArgs = [];

  for (let i = 0; i < remainingTokens.length; i++) {
    const token = remainingTokens[i];
    if (token === '--dry-run') {
      flags.dryRun = true;
    } else if (token === '--json') {
      flags.json = true;
    } else if (token === '--all') {
      flags.all = true;
    } else if (token === '--check') {
      flags.check = true;
    } else if (token === '--yes' || token === '-y') {
      flags.yes = true;
    } else if (token === '--ref') {
      if (i + 1 < remainingTokens.length) {
        flags.ref = remainingTokens[++i];
      }
    } else if (token.startsWith('--ref=')) {
      flags.ref = token.split('=')[1];
    } else if (token === '--source') {
      if (i + 1 < remainingTokens.length) {
        flags.source = remainingTokens[++i];
      }
    } else if (token.startsWith('--source=')) {
      flags.source = token.split('=')[1];
    } else if (token === '--project' || token === '-p') {
      if (i + 1 < remainingTokens.length) {
        flags.project = remainingTokens[++i];
      }
    } else if (token.startsWith('--project=')) {
      flags.project = token.split('=')[1];
    } else if (token === '--reason') {
      if (i + 1 < remainingTokens.length) {
        flags.reason = remainingTokens[++i];
      }
    } else if (token.startsWith('--reason=')) {
      flags.reason = token.split('=')[1];
    } else if (token === '--help' || token === '-h') {
      flags.help = true;
    } else {
      positionalArgs.push(token);
    }
  }

  // Validate project path
  if (flags.project && checkPathTraversal(flags.project)) {
    return {
      raw,
      command,
      subcommand: null,
      task: null,
      args: positionalArgs,
      flags,
      valid: false,
      error: `Security violation: Path traversal detected in project path '${flags.project}'`
    };
  }

  // Check subcommands vs natural language tasks
  let subcommand = null;
  let task = null;

  if (command === 'setup-project-skills') {
    const supportedModes = ['initial', 'audit', 'update', 'repair', 'report', 'skip-setup', 'verify-setup'];
    const modeCandidate = positionalArgs[0] ? positionalArgs[0].toLowerCase() : 'initial';
    if (supportedModes.includes(modeCandidate)) {
      subcommand = modeCandidate;
      positionalArgs.shift();
    } else if (positionalArgs.length === 0) {
      subcommand = 'initial';
    } else {
      return {
        raw,
        command,
        subcommand: null,
        task: null,
        args: positionalArgs,
        flags,
        valid: false,
        error: `Unknown setup mode '${positionalArgs[0]}'. Supported modes: initial, audit, update, repair, report, skip-setup, verify-setup.`
      };
    }
  } else if (command === 'mo7i') {
    if (flags.help) {
      subcommand = 'help';
    } else if (positionalArgs.length === 0) {
      subcommand = 'help';
    } else {
      const candidate = positionalArgs[0].toLowerCase();
      const validSubcommands = ['help', 'setup', 'audit', 'learn', 'discover', 'status', 'doctor', 'update', 'self-update', 'selfupdate', 'selftest'];
      if (validSubcommands.includes(candidate)) {
        subcommand = candidate;
        positionalArgs.shift(); // remove subcommand from args
      } else {
        // Natural language task
        task = positionalArgs.join(' ');
      }
    }
  }

  return {
    raw,
    command,
    subcommand,
    task,
    args: positionalArgs,
    flags,
    valid: true,
    error: null
  };
}

module.exports = {
  parseCommand,
  tokenizeArguments,
  sanitizeInput,
  checkPathTraversal
};
