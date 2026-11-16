/**
 * MO7I Universal Intelligence — Command Registry
 * Version: 2.3.0
 * 
 * Canonical registry of all official slash commands, descriptions, parameters,
 * safety profiles, and platform mappings.
 */

const COMMANDS = [
  {
    id: 'mo7i-root',
    trigger: '/mo7i',
    alias: 'mo7i',
    summary: 'Universal Intelligence Meta-Orchestrator entry point',
    description: 'Accepts natural-language engineering tasks across 13 domains, inspects project context, discovers skills, plans execution, executes, and verifies with evidence.',
    usage: '/mo7i <task-description>',
    examples: [
      '/mo7i Build a modern Next.js landing page with Tailwind CSS',
      '/mo7i Audit my project security and container configurations',
      '/mo7i Research the best database architecture for high concurrency',
      '/mo7i Improve the SEO and OpenGraph metadata of this website'
    ],
    readOnly: false,
    requiresApproval: false, // Orchestrator gates only on destructive actions
    supportedPlatforms: ['t3-code', 'claude-code', 'cursor', 'codex', 'gemini-cli', 'universal-cli']
  },
  {
    id: 'mo7i-help',
    trigger: '/mo7i help',
    alias: 'mo7i help',
    summary: 'Display help, available commands, syntax, and examples',
    description: 'Displays a comprehensive summary of all registered MO7I slash commands, usage parameters, operating modes, and platform compatibility.',
    usage: '/mo7i help',
    examples: [
      '/mo7i help'
    ],
    readOnly: true,
    requiresApproval: false,
    supportedPlatforms: ['t3-code', 'claude-code', 'cursor', 'codex', 'gemini-cli', 'universal-cli']
  },
  {
    id: 'setup-project-skills',
    trigger: '/setup-project-skills',
    alias: 'setup-project-skills',
    summary: 'Analyze project stack, provision skills, and manage post-install setups',
    description: 'Analyzes project dependencies and architecture, integrates verified Matt Pocock skills and stack specialists into project scope, and tracks post-install setup lifecycles.',
    usage: '/setup-project-skills [initial|audit|update|repair|report|skip-setup|verify-setup] [--dry-run] [--project <path>]',
    examples: [
      '/setup-project-skills initial',
      '/setup-project-skills initial --dry-run',
      '/setup-project-skills audit',
      '/setup-project-skills update',
      '/setup-project-skills repair',
      '/setup-project-skills report',
      '/setup-project-skills skip-setup setup-matt-pocock-skills --reason "custom tracking"',
      '/setup-project-skills verify-setup setup-matt-pocock-skills'
    ],
    readOnly: false,
    requiresApproval: false,
    supportedPlatforms: ['t3-code', 'claude-code', 'cursor', 'codex', 'gemini-cli', 'universal-cli']
  },
  {
    id: 'mo7i-audit',
    trigger: '/mo7i audit',
    alias: 'mo7i audit',
    summary: 'Read-only audit of project stack, skills, configuration, and capabilities',
    description: 'Performs a comprehensive, non-destructive audit of the current workspace, detecting installed skills, missing capabilities, configuration health, and drift.',
    usage: '/mo7i audit [--project <path>]',
    examples: [
      '/mo7i audit',
      '/mo7i audit --project ./services/web'
    ],
    readOnly: true,
    requiresApproval: false,
    supportedPlatforms: ['t3-code', 'claude-code', 'cursor', 'codex', 'gemini-cli', 'universal-cli']
  },
  {
    id: 'mo7i-learn',
    trigger: '/mo7i learn',
    alias: 'mo7i learn',
    summary: 'Activate Skill Learning Engine (Inspect -> Understand -> Integrate -> Validate)',
    description: 'Executes the 4-phase learning loop on installed or discovered skills, synthesizing operational contracts and checking binary availability.',
    usage: '/mo7i learn [skill-name]',
    examples: [
      '/mo7i learn',
      '/mo7i learn nextjs-best-practices',
      '/mo7i learn codebase-design'
    ],
    readOnly: false,
    requiresApproval: false,
    supportedPlatforms: ['t3-code', 'claude-code', 'cursor', 'codex', 'gemini-cli', 'universal-cli']
  },
  {
    id: 'mo7i-discover',
    trigger: '/mo7i discover',
    alias: 'mo7i discover',
    summary: 'Search skills.sh via find-skills with 5-dimension scoring',
    description: 'Searches for specialist skills on skills.sh without installing them automatically. Evaluates relevance, publisher reputation, adoption, documentation, and security.',
    usage: '/mo7i discover <query>',
    examples: [
      '/mo7i discover nextjs',
      '/mo7i discover flutter bloc',
      '/mo7i discover "playwright e2e"'
    ],
    readOnly: true,
    requiresApproval: false,
    supportedPlatforms: ['t3-code', 'claude-code', 'cursor', 'codex', 'gemini-cli', 'universal-cli']
  },
  {
    id: 'mo7i-status',
    trigger: '/mo7i status',
    alias: 'mo7i status',
    summary: 'Display MO7I system status, project profile, and active engines',
    description: 'Displays release version, current workspace path, detected stack archetype, installed skills inventory, setup status, and knowledge database health.',
    usage: '/mo7i status [--project <path>]',
    examples: [
      '/mo7i status',
      '/mo7i status --json'
    ],
    readOnly: true,
    requiresApproval: false,
    supportedPlatforms: ['t3-code', 'claude-code', 'cursor', 'codex', 'gemini-cli', 'universal-cli']
  },
  {
    id: 'mo7i-doctor',
    trigger: '/mo7i doctor',
    alias: 'mo7i doctor',
    summary: 'Diagnostic checks for runtimes, scripts, registries, and slash command links',
    description: 'Validates node/npm environment, Skills CLI availability, command registrations in .claude/commands, file integrity, and registry consistency.',
    usage: '/mo7i doctor [--project <path>]',
    examples: [
      '/mo7i doctor'
    ],
    readOnly: true,
    requiresApproval: false,
    supportedPlatforms: ['t3-code', 'claude-code', 'cursor', 'codex', 'gemini-cli', 'universal-cli']
  },
  {
    id: 'mo7i-update',
    trigger: '/mo7i update',
    alias: 'mo7i update',
    summary: 'Check for stack changes, skill updates, and registry sync',
    description: 'Detects new project dependencies, identifies newly recommended skills, checks upstream updates, and safely synchronizes the project registry with backups.',
    usage: '/mo7i update [--dry-run] [--project <path>]',
    examples: [
      '/mo7i update',
      '/mo7i update --dry-run'
    ],
    readOnly: false,
    requiresApproval: true, // Gate before updating packages
    supportedPlatforms: ['t3-code', 'claude-code', 'cursor', 'codex', 'gemini-cli', 'universal-cli']
  },
  {
    id: 'mo7i-self-update',
    trigger: '/mo7i self-update',
    alias: 'mo7i self-update',
    summary: 'Self-update MO7I skills to latest release with backup and rollback',
    description: 'Checks installed version vs latest remote release, backs up MO7I skills to .mo7i/backups/, safely updates mo7i and mo7i-project-setup via skills CLI, runs doctor verification, and logs telemetry.',
    usage: '/mo7i self-update [--check] [--yes] [--dry-run] [--ref <branch|tag>]',
    examples: [
      '/mo7i self-update --check',
      '/mo7i self-update',
      '/mo7i self-update --yes',
      '/mo7i self-update --dry-run',
      '/mo7i self-update --ref main'
    ],
    readOnly: false,
    requiresApproval: true,
    supportedPlatforms: ['t3-code', 'claude-code', 'cursor', 'codex', 'gemini-cli', 'universal-cli']
  },
  {
    id: 'mo7i-selftest',
    trigger: '/mo7i selftest',
    alias: 'mo7i selftest',
    summary: 'Black-box independent verification of installed MO7I skills',
    description: 'Installs MO7I into an isolated temporary project, runs black-box acceptance tests against the installed skill footprint (not repo source), and outputs raw JSON with pass/fail per check.',
    usage: '/mo7i selftest [--source <path|repo>] [--json]',
    examples: [
      '/mo7i selftest',
      '/mo7i selftest --source /path/to/repo',
      '/mo7i selftest --json'
    ],
    readOnly: true,
    requiresApproval: false,
    supportedPlatforms: ['t3-code', 'claude-code', 'cursor', 'codex', 'gemini-cli', 'universal-cli']
  }
];

function getCommand(triggerOrAlias) {
  const normalized = triggerOrAlias.toLowerCase().trim().replace(/^\//, '');
  return COMMANDS.find(c => 
    c.alias === normalized ||
    c.trigger === `/${normalized}` ||
    c.id === normalized
  ) || null;
}

function getAllCommands() {
  return COMMANDS;
}

module.exports = {
  COMMANDS,
  getCommand,
  getAllCommands
};
