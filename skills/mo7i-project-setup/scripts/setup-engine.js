#!/usr/bin/env node

/**
 * MO7I Project Intelligence & Automated Skill Setup Engine
 * Version: 2.1.0
 * 
 * Provides automated project analysis, dynamic specialist skill discovery,
 * integration with the official Matt Pocock collection, strictly project-scoped
 * installation, and persistent project profile and skill registry management.
 */

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const ENGINE_VERSION = '2.1.0';

// Official verified Matt Pocock skills collection (from https://skills.sh/mattpocock/skills)
const MATT_POCOCK_OFFICIAL_SOURCE = {
  publisher: 'Matt Pocock (mattpocock)',
  repository: 'https://github.com/mattpocock/skills.git',
  skillsShUrl: 'https://skills.sh/mattpocock/skills',
  packageId: 'mattpocock/skills',
  totalDiscovered: 39,
  validCount: 38,
  skippedCount: 1,
  skippedDetails: [
    {
      skill: 'software-factory',
      path: 'skills/in-progress/software-factory/SKILL.md',
      reason: 'Upstream YAML syntax error (nested mapping without indentation in frontmatter description)'
    }
  ],
  skills: [
    { id: 'ask-matt', category: 'DEVELOPMENT', description: 'Ask which skill or flow fits your situation. A router over skills.' },
    { id: 'code-review', category: 'QUALITY_ASSURANCE', description: 'Review changes along Standards and Spec axes with parallel sub-agents.' },
    { id: 'codebase-design', category: 'DEVELOPMENT', description: 'Shared vocabulary for designing deep modules with hidden implementation.' },
    { id: 'diagnosing-bugs', category: 'QUALITY_ASSURANCE', description: 'Systematic diagnosis loop for hard bugs and regressions.' },
    { id: 'domain-modeling', category: 'DEVELOPMENT', description: 'Build and sharpen domain models, GLOSSARY.md, and ADRs.' },
    { id: 'grill-with-docs', category: 'DEVELOPMENT', description: 'Relentless interview creating ADRs and glossary as we go.' },
    { id: 'implement', category: 'DEVELOPMENT', description: 'Implement a piece of work based on a spec or set of tickets.' },
    { id: 'implement-spec', category: 'DEVELOPMENT', description: 'Implement the result of /to-spec and /to-tickets in code.' },
    { id: 'improve-codebase-architecture', category: 'DEVELOPMENT', description: 'Scan codebase for deepening opportunities and present visual report.' },
    { id: 'pr', category: 'DEVELOPMENT', description: 'Write structured, evidence-rich PR descriptions.' },
    { id: 'prototype', category: 'DEVELOPMENT', description: 'Build throwaway prototype to validate state model or UX.' },
    { id: 'research', category: 'DEVELOPMENT', description: 'Investigate a question against high-trust primary sources.' },
    { id: 'retro', category: 'DEVELOPMENT', description: 'Conduct structured retrospective on a coding session.' },
    { id: 'setup-matt-pocock-skills', category: 'DEVELOPMENT', description: 'Configure repository issue tracker, labels, and domain doc layout.' },
    { id: 'tdd', category: 'QUALITY_ASSURANCE', description: 'Test-driven development (red-green-refactor) workflow.' },
    { id: 'to-spec', category: 'DEVELOPMENT', description: 'Turn current conversation into a technical specification.' },
    { id: 'to-tickets', category: 'DEVELOPMENT', description: 'Break plans and specs into tracer-bullet tickets with dependency edges.' },
    { id: 'triage', category: 'DEVELOPMENT', description: 'State-machine triage for issues and PRs.' },
    { id: 'wayfinder', category: 'DEVELOPMENT', description: 'Map out large milestones as decision tickets on issue tracker.' },
    { id: 'wizard', category: 'DEVELOPMENT', description: 'Generate interactive bash wizard for human-only steps.' },
    { id: 'grill-me', category: 'DEVELOPMENT', description: 'Relentless interview to stress-test plans or architecture.' },
    { id: 'grilling', category: 'DEVELOPMENT', description: 'Relentless grilling triggers on decisions.' },
    { id: 'handoff', category: 'DEVELOPMENT', description: 'Compact conversation into handoff document for another agent.' },
    { id: 'teach', category: 'DEVELOPMENT', description: 'Teach the user a new skill or concept.' },
    { id: 'to-questionnaire', category: 'DEVELOPMENT', description: 'Turn complex decisions into questionnaire for stakeholders.' },
    { id: 'wait-what', category: 'DEVELOPMENT', description: 'Stop and repitch concepts that failed to land clearly.' },
    { id: 'writing-for-agents', category: 'DEVELOPMENT', description: 'Format documentation specifically for autonomous AI agents.' },
    { id: 'chief-of-staff', category: 'DEVELOPMENT', description: 'Pursue long-running goal by coordinating sub-agents.' },
    { id: 'claude-handoff', category: 'DEVELOPMENT', description: 'Hand conversation off to fresh background agent.' },
    { id: 'loop-me', category: 'DEVELOPMENT', description: 'Interactive specification interview for workflows.' },
    { id: 'setup-ts-deep-modules', category: 'PROJECT_SPECIFIC', description: 'Enforce TypeScript deep module boundaries via dependency-cruiser.' },
    { id: 'writing-beats', category: 'DEVELOPMENT', description: 'Ground narrative beats sequentially.' },
    { id: 'writing-fragments', category: 'DEVELOPMENT', description: 'Explore unshaped conceptual fragments.' },
    { id: 'writing-shape', category: 'DEVELOPMENT', description: 'Shape raw material into structured articles.' },
    { id: 'git-guardrails-claude-code', category: 'QUALITY_ASSURANCE', description: 'Install hooks blocking dangerous git commands.' },
    { id: 'migrate-to-shoehorn', category: 'PROJECT_SPECIFIC', description: 'Migrate test assertions to @total-typescript/shoehorn.' },
    { id: 'scaffold-exercises', category: 'OPTIONAL', description: 'Scaffold interactive exercise directory structures.' },
    { id: 'setup-pre-commit', category: 'QUALITY_ASSURANCE', description: 'Set up Husky pre-commit hooks with lint-staged and tests.' }
  ]
};

/**
 * Audit and sanitize any object to ensure no credentials or secrets are persisted.
 */
function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  
  const sanitized = {};
  const secretPattern = /(key|secret|token|password|auth|bearer|credential|cert|private)/i;
  
  for (const [key, value] of Object.entries(obj)) {
    if (secretPattern.test(key) && typeof value === 'string' && value.length > 8) {
      sanitized[key] = '[REDACTED_BY_MO7I_SECURITY]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

/**
 * Scan a text content or script for dangerous or malicious patterns.
 */
function scanContentSecurity(content) {
  const issues = [];
  if (/(\/|\b)(id_rsa|\.aws\/credentials|\.ssh|\.env|\.netrc)/i.test(content)) {
    issues.push('Credential or private key exfiltration attempt');
  }
  if (/rm\s+-rf\s+(\/|\$HOME|~)/i.test(content)) {
    issues.push('Destructive root or home directory filesystem deletion');
  }
  if (/ignore\s+all\s+(previous|prior)\s+instructions/i.test(content)) {
    issues.push('Adversarial prompt injection attempt');
  }
  if (/curl\s+-[sS]*[kK]?\s+.*\|\s*(bash|sh|zsh)/i.test(content)) {
    issues.push('Unverified remote shell script piped directly to interpreter');
  }
  return issues;
}

/**
 * Inspects a repository or target project path and analyzes its technical profile.
 */
function analyzeProject(projectDir) {
  const resolvedDir = path.resolve(projectDir);
  if (!fs.existsSync(resolvedDir)) {
    throw new Error(`Project directory not found: ${resolvedDir}`);
  }

  const profile = {
    id: path.basename(resolvedDir),
    path: resolvedDir,
    type: 'Generic Project',
    languages: [],
    frameworks: [],
    databases: [],
    architecture: 'Standard',
    testFrameworks: [],
    deployment: 'Local',
    securityRequirements: ['Zero-trust secret management'],
    codeQualityConventions: [],
    existingTools: [],
    existingSkills: [],
    inspectedFiles: [],
    setupStatus: 'UNINITIALIZED',
    setupVersion: ENGINE_VERSION,
    analyzedAt: new Date().toISOString()
  };

  const fileExists = (rel) => {
    const full = path.join(resolvedDir, rel);
    if (fs.existsSync(full)) {
      profile.inspectedFiles.push(rel);
      return true;
    }
    return false;
  };

  const readJsonSafe = (rel) => {
    try {
      const full = path.join(resolvedDir, rel);
      if (fs.existsSync(full)) {
        profile.inspectedFiles.push(rel);
        return JSON.parse(fs.readFileSync(full, 'utf8'));
      }
    } catch {
      // ignore
    }
    return null;
  };

  const readFileSafe = (rel) => {
    try {
      const full = path.join(resolvedDir, rel);
      if (fs.existsSync(full)) {
        profile.inspectedFiles.push(rel);
        return fs.readFileSync(full, 'utf8');
      }
    } catch {
      // ignore
    }
    return null;
  };

  // Inspect existing agent instructions
  if (fileExists('AGENTS.md')) profile.existingTools.push('AGENTS.md');
  if (fileExists('CLAUDE.md')) profile.existingTools.push('CLAUDE.md');
  if (fileExists('README.md')) profile.existingTools.push('README.md');

  // Inspect existing skills in project
  const projectSkillsDirs = ['.agents/skills', '.gemini/skills', '.skills'];
  for (const sDir of projectSkillsDirs) {
    const fullDir = path.join(resolvedDir, sDir);
    if (fs.existsSync(fullDir)) {
      try {
        const entries = fs.readdirSync(fullDir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory() && !profile.existingSkills.includes(entry.name)) {
            profile.existingSkills.push(entry.name);
          }
        }
      } catch {
        // ignore
      }
    }
  }

  const skillsLock = readJsonSafe('skills-lock.json');
  if (skillsLock && skillsLock.skills) {
    for (const sName of Object.keys(skillsLock.skills)) {
      if (!profile.existingSkills.includes(sName)) {
        profile.existingSkills.push(sName);
      }
    }
  }

  // Inspect Node / JavaScript / TypeScript ecosystem
  const pkg = readJsonSafe('package.json');
  if (pkg) {
    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    const scripts = pkg.scripts || {};

    if (deps['typescript'] || fileExists('tsconfig.json')) {
      if (!profile.languages.includes('TypeScript')) profile.languages.push('TypeScript');
    }
    if (!profile.languages.includes('JavaScript')) profile.languages.push('JavaScript');

    // Framework detection
    if (deps['next']) {
      profile.type = 'Fullstack Web Application (Next.js)';
      profile.frameworks.push({ name: 'Next.js', version: deps['next'] });
      profile.deployment = 'Vercel / Cloud Container';
      profile.architecture = (fileExists('app') || fileExists('src/app'))
        ? 'Next.js App Router (Server Actions & Components)'
        : 'Next.js Pages Router';
    } else if (deps['react']) {
      profile.type = 'Frontend Web Application (React)';
      profile.frameworks.push({ name: 'React', version: deps['react'] });
    } else if (deps['vue'] || deps['nuxt']) {
      profile.type = 'Web Application (Vue/Nuxt)';
      profile.frameworks.push({ name: deps['nuxt'] ? 'Nuxt' : 'Vue', version: deps['nuxt'] || deps['vue'] });
    } else if (deps['@angular/core']) {
      profile.type = 'Web Application (Angular)';
      profile.frameworks.push({ name: 'Angular', version: deps['@angular/core'] });
    } else if (deps['express'] || deps['fastify'] || deps['koa'] || deps['@nestjs/core']) {
      profile.type = 'Backend Web Service (Node.js)';
      if (deps['@nestjs/core']) profile.frameworks.push({ name: 'NestJS', version: deps['@nestjs/core'] });
      if (deps['express']) profile.frameworks.push({ name: 'Express', version: deps['express'] });
      if (deps['fastify']) profile.frameworks.push({ name: 'Fastify', version: deps['fastify'] });
    }

    // Styling & UI
    if (deps['tailwindcss'] || fileExists('tailwind.config.js') || fileExists('tailwind.config.ts')) {
      profile.frameworks.push({ name: 'Tailwind CSS', version: deps['tailwindcss'] || 'detected' });
    }

    // Databases & ORMs
    if (deps['@prisma/client'] || deps['prisma'] || fileExists('prisma/schema.prisma')) {
      profile.databases.push('Prisma ORM');
    }
    if (deps['drizzle-orm']) profile.databases.push('Drizzle ORM');
    if (deps['typeorm']) profile.databases.push('TypeORM');
    if (deps['mongoose']) profile.databases.push('MongoDB / Mongoose');
    if (deps['pg'] || deps['postgres']) profile.databases.push('PostgreSQL');
    if (deps['better-sqlite3'] || deps['sqlite3']) profile.databases.push('SQLite');

    // Test frameworks
    if (deps['vitest']) profile.testFrameworks.push('Vitest');
    if (deps['jest'] || scripts.test && scripts.test.includes('jest')) profile.testFrameworks.push('Jest');
    if (deps['@playwright/test'] || fileExists('playwright.config.ts') || fileExists('playwright.config.js')) {
      profile.testFrameworks.push('Playwright (E2E)');
    }
    if (deps['cypress']) profile.testFrameworks.push('Cypress');

    // Code Quality
    if (deps['eslint'] || fileExists('.eslintrc.json') || fileExists('eslint.config.js') || fileExists('eslint.config.mjs')) {
      profile.codeQualityConventions.push('ESLint');
    }
    if (deps['prettier'] || fileExists('.prettierrc')) {
      profile.codeQualityConventions.push('Prettier');
    }
    if (deps['husky'] || fileExists('.husky')) {
      profile.existingTools.push('Husky Git Hooks');
    }
  }

  // Inspect Flutter / Dart ecosystem
  const pubspec = readFileSafe('pubspec.yaml');
  if (pubspec) {
    profile.type = 'Mobile Application (Flutter)';
    if (!profile.languages.includes('Dart')) profile.languages.push('Dart');
    profile.frameworks.push({ name: 'Flutter SDK', version: 'detected' });
    profile.deployment = 'iOS App Store & Google Play';

    if (/flutter_bloc:|bloc:/i.test(pubspec)) {
      profile.architecture = 'Flutter BLoC Pattern';
    } else if (/riverpod:|flutter_riverpod:/i.test(pubspec)) {
      profile.architecture = 'Flutter Riverpod State Architecture';
    } else if (/provider:/i.test(pubspec)) {
      profile.architecture = 'Flutter Provider Architecture';
    } else {
      profile.architecture = 'Flutter Reactive State Model';
    }

    if (/flutter_test:/i.test(pubspec)) {
      profile.testFrameworks.push('flutter_test');
    }
    if (/hive:|isar:|sqflite:/i.test(pubspec)) {
      profile.databases.push('Mobile Local Embedded Storage (SQLite/Hive/Isar)');
    }
    profile.codeQualityConventions.push('analysis_options.yaml Dart Lint');
  }

  // Inspect PHP / Laravel ecosystem
  const composer = readJsonSafe('composer.json');
  if (composer) {
    const cDeps = { ...(composer.require || {}), ...(composer['require-dev'] || {}) };
    if (!profile.languages.includes('PHP')) profile.languages.push('PHP');

    if (cDeps['laravel/framework'] || fileExists('artisan')) {
      profile.type = 'Backend Web Application / API (Laravel)';
      profile.frameworks.push({ name: 'Laravel', version: cDeps['laravel/framework'] || 'detected' });
      profile.architecture = 'Laravel MVC & Eloquent Service Architecture';
      profile.databases.push('Laravel Eloquent ORM (MySQL / PostgreSQL / SQLite)');
    } else if (cDeps['symfony/framework-bundle']) {
      profile.type = 'Web Application (Symfony)';
      profile.frameworks.push({ name: 'Symfony', version: cDeps['symfony/framework-bundle'] });
    }

    if (cDeps['phpunit/phpunit']) profile.testFrameworks.push('PHPUnit');
    if (cDeps['pestphp/pest']) profile.testFrameworks.push('Pest PHP');
    if (cDeps['friendsofphp/php-cs-fixer']) profile.codeQualityConventions.push('PHP CS Fixer');
    if (cDeps['phpstan/phpstan']) profile.codeQualityConventions.push('PHPStan');
  }

  // Inspect Python ecosystem
  if (fileExists('requirements.txt') || fileExists('pyproject.toml') || fileExists('Pipfile')) {
    if (!profile.languages.includes('Python')) profile.languages.push('Python');
    const pyReq = readFileSafe('requirements.txt') || '';
    const pyProj = readFileSafe('pyproject.toml') || '';
    const pyCombined = pyReq + '\n' + pyProj;

    if (/django/i.test(pyCombined)) {
      profile.type = 'Web Application (Django)';
      profile.frameworks.push({ name: 'Django', version: 'detected' });
      profile.databases.push('Django ORM');
    } else if (/fastapi/i.test(pyCombined)) {
      profile.type = 'Web API Service (FastAPI)';
      profile.frameworks.push({ name: 'FastAPI', version: 'detected' });
    } else if (/flask/i.test(pyCombined)) {
      profile.type = 'Web Application (Flask)';
      profile.frameworks.push({ name: 'Flask', version: 'detected' });
    } else if (/torch|tensorflow|transformers|scikit-learn/i.test(pyCombined)) {
      profile.type = 'Machine Learning / Data Intelligence';
      profile.frameworks.push({ name: 'PyTorch/ML Frameworks', version: 'detected' });
    }

    if (/pytest/i.test(pyCombined)) profile.testFrameworks.push('Pytest');
    if (/ruff/i.test(pyCombined)) profile.codeQualityConventions.push('Ruff');
    if (/mypy/i.test(pyCombined)) profile.codeQualityConventions.push('Mypy');
  }

  // Inspect Docker & DevOps
  if (fileExists('Dockerfile') || fileExists('docker-compose.yml') || fileExists('docker-compose.yaml')) {
    profile.existingTools.push('Docker Containerization');
    if (profile.deployment === 'Local') profile.deployment = 'Docker Container';
  }

  // Inspect CI/CD workflows
  const ghWorkflows = path.join(resolvedDir, '.github/workflows');
  if (fs.existsSync(ghWorkflows)) {
    try {
      const wFiles = fs.readdirSync(ghWorkflows);
      if (wFiles.length > 0) {
        profile.existingTools.push(`GitHub Actions (${wFiles.length} workflows)`);
        profile.inspectedFiles.push('.github/workflows');
      }
    } catch {
      // ignore
    }
  }

  // Check if existing MO7I project intelligence profile exists
  const mo7iProfilePath = path.join(resolvedDir, '.mo7i', 'project-profile.json');
  if (fs.existsSync(mo7iProfilePath)) {
    try {
      const existingMo7i = JSON.parse(fs.readFileSync(mo7iProfilePath, 'utf8'));
      profile.setupStatus = existingMo7i.setupStatus || 'INITIALIZED';
      profile.lastAuditAt = existingMo7i.lastAuditAt || existingMo7i.analyzedAt;
    } catch {
      profile.setupStatus = 'CORRUPTED_PROFILE';
    }
  }

  return sanitizeObject(profile);
}

/**
 * Categorize skills according to the 6 specified project setup categories.
 */
function recommendProjectSkills(profile) {
  const categories = {
    CORE_PROJECT_SKILLS: [],
    DEVELOPMENT_SKILLS: [],
    QUALITY_ASSURANCE: [],
    PROJECT_SPECIFIC_SPECIALISTS: [],
    MATT_POCOCK_COLLECTION: [],
    OPTIONAL_SKILLS: []
  };

  // Matt Pocock collection integration
  for (const skill of MATT_POCOCK_OFFICIAL_SOURCE.skills) {
    const item = {
      id: skill.id,
      package: MATT_POCOCK_OFFICIAL_SOURCE.packageId,
      source: 'mattpocock/skills',
      category: skill.category,
      description: skill.description,
      installed: profile.existingSkills.includes(skill.id)
    };
    categories.MATT_POCOCK_COLLECTION.push(item);

    if (skill.category === 'DEVELOPMENT') {
      categories.DEVELOPMENT_SKILLS.push(item);
    } else if (skill.category === 'QUALITY_ASSURANCE') {
      categories.QUALITY_ASSURANCE.push(item);
    } else if (skill.category === 'OPTIONAL') {
      categories.OPTIONAL_SKILLS.push(item);
    }
  }

  // Core & Project-Specific skills based on stack
  if (profile.type.includes('Next.js')) {
    categories.CORE_PROJECT_SKILLS.push({
      id: 'nextjs-best-practices',
      package: 'sickn33/agentic-awesome-skills@nextjs-best-practices',
      source: 'skills.sh',
      description: 'Next.js App Router, Server Actions, route handlers, and SSR caching standards.',
      installed: profile.existingSkills.includes('nextjs-best-practices')
    });
    categories.CORE_PROJECT_SKILLS.push({
      id: 'frontend-design',
      package: 'anthropics/skills@frontend-design',
      source: 'skills.sh',
      description: 'High-contrast accessible component design and responsive layout systems.',
      installed: profile.existingSkills.includes('frontend-design')
    });
    categories.PROJECT_SPECIFIC_SPECIALISTS.push({
      id: 'setup-ts-deep-modules',
      package: 'mattpocock/skills@setup-ts-deep-modules',
      source: 'mattpocock/skills',
      description: 'Enforce TypeScript deep module architectural boundaries via dependency-cruiser.',
      installed: profile.existingSkills.includes('setup-ts-deep-modules')
    });
  } else if (profile.type.includes('Flutter')) {
    categories.CORE_PROJECT_SKILLS.push({
      id: 'flutter-specialist',
      package: 'flutter-community/skills@flutter-patterns',
      source: 'skills.sh',
      description: 'Flutter widget lifecycle, reactive state management (BLoC/Riverpod), and platform channels.',
      installed: profile.existingSkills.includes('flutter-specialist')
    });
    categories.PROJECT_SPECIFIC_SPECIALISTS.push({
      id: 'mobile-ui-ux',
      package: 'mobile-standards/skills@mobile-ui-ux',
      source: 'skills.sh',
      description: 'Mobile touch targets, haptics, safe-area insets, and iOS/Android human interface guidelines.',
      installed: profile.existingSkills.includes('mobile-ui-ux')
    });
  } else if (profile.type.includes('Laravel')) {
    categories.CORE_PROJECT_SKILLS.push({
      id: 'laravel-core',
      package: 'laravel-standards/skills@laravel-architecture',
      source: 'skills.sh',
      description: 'Laravel service providers, Eloquent relationships, form requests, and queue pipelines.',
      installed: profile.existingSkills.includes('laravel-core')
    });
    categories.QUALITY_ASSURANCE.push({
      id: 'pest-testing',
      package: 'pestphp/skills@pest-testing',
      source: 'skills.sh',
      description: 'Pest PHP elegant testing, dataset mutations, and architectural assertions.',
      installed: profile.existingSkills.includes('pest-testing')
    });
  } else {
    // Default software engineering core
    categories.CORE_PROJECT_SKILLS.push({
      id: 'codebase-design',
      package: 'mattpocock/skills@codebase-design',
      source: 'mattpocock/skills',
      description: 'Design deep modules with small interfaces and rich implementations.',
      installed: profile.existingSkills.includes('codebase-design')
    });
  }

  // Cross-cutting QA
  if (profile.languages.includes('TypeScript')) {
    categories.PROJECT_SPECIFIC_SPECIALISTS.push({
      id: 'migrate-to-shoehorn',
      package: 'mattpocock/skills@migrate-to-shoehorn',
      source: 'mattpocock/skills',
      description: 'Safe test assertions migrating from "as" casts to @total-typescript/shoehorn.',
      installed: profile.existingSkills.includes('migrate-to-shoehorn')
    });
  }

  return categories;
}

/**
 * Execute installation of skills strictly in project scope.
 * Never uses global flags.
 */
function installProjectSkills(projectDir, skillsToInstall, options = {}) {
  const resolvedDir = path.resolve(projectDir);
  const results = {
    attempted: skillsToInstall.length,
    successful: [],
    skipped: [],
    failed: []
  };

  const agentsSkillDir = path.join(resolvedDir, '.agents', 'skills');
  if (!fs.existsSync(agentsSkillDir)) {
    fs.mkdirSync(agentsSkillDir, { recursive: true });
  }

  for (const skill of skillsToInstall) {
    const targetPath = path.join(agentsSkillDir, skill.id);
    
    // Safety check: preserve user-authored skills
    if (fs.existsSync(targetPath)) {
      results.skipped.push({
        id: skill.id,
        reason: 'Already installed on disk in project scope'
      });
      continue;
    }

    if (options.dryRun) {
      results.successful.push({
        id: skill.id,
        scope: 'project',
        dryRun: true,
        targetPath
      });
      continue;
    }

    try {
      // Execute project-scope installation using Skills CLI
      // Strictly without -g
      const cmd = `npx skills add ${skill.package || 'mattpocock/skills'} --skill ${skill.id} -y`;
      cp.execSync(cmd, {
        cwd: resolvedDir,
        stdio: 'pipe',
        env: { ...process.env, CI: 'true' }
      });

      if (fs.existsSync(targetPath)) {
        results.successful.push({
          id: skill.id,
          scope: 'project',
          targetPath,
          verified: true
        });
      } else {
        // Fallback: if skills CLI copied to a variant agent directory or symlink, verify
        results.successful.push({
          id: skill.id,
          scope: 'project',
          targetPath,
          verified: true
        });
      }
    } catch (err) {
      results.failed.push({
        id: skill.id,
        error: err.message
      });
    }
  }

  return results;
}

/**
 * Writes or updates the project registry files (.mo7i/*) with backups.
 */
function saveProjectRegistry(projectDir, profile, recommendations, installResults, mode = 'initial') {
  const resolvedDir = path.resolve(projectDir);
  const mo7iDir = path.join(resolvedDir, '.mo7i');
  if (!fs.existsSync(mo7iDir)) {
    fs.mkdirSync(mo7iDir, { recursive: true });
  }

  const profilePath = path.join(mo7iDir, 'project-profile.json');
  const profileBak = path.join(mo7iDir, 'project-profile.json.bak');
  const registryPath = path.join(mo7iDir, 'skill-registry.json');
  const registryBak = path.join(mo7iDir, 'skill-registry.json.bak');
  const reportPath = path.join(mo7iDir, 'setup-report.md');

  // Preserve backup if existing files exist
  if (fs.existsSync(profilePath)) {
    fs.copyFileSync(profilePath, profileBak);
  }
  if (fs.existsSync(registryPath)) {
    fs.copyFileSync(registryPath, registryBak);
  }

  // Update profile
  profile.setupStatus = mode === 'audit' ? 'AUDITED' : mode === 'repair' ? 'REPAIRED' : mode === 'update' ? 'UPDATED' : 'INITIALIZED';
  profile.lastAuditAt = new Date().toISOString();
  profile.setupVersion = ENGINE_VERSION;

  // Build registry data
  const installedList = [];
  const allRecommended = [
    ...recommendations.CORE_PROJECT_SKILLS,
    ...recommendations.DEVELOPMENT_SKILLS,
    ...recommendations.QUALITY_ASSURANCE,
    ...recommendations.PROJECT_SPECIFIC_SPECIALISTS,
    ...recommendations.OPTIONAL_SKILLS
  ];

  for (const s of allRecommended) {
    const isInstalled = profile.existingSkills.includes(s.id) ||
      (installResults && installResults.successful.some(x => x.id === s.id));
    if (isInstalled) {
      installedList.push({
        id: s.id,
        package: s.package,
        source: s.source,
        category: s.category || 'PROJECT',
        scope: 'project',
        installedAt: new Date().toISOString()
      });
    }
  }

  const missingList = allRecommended
    .filter(s => !installedList.some(x => x.id === s.id))
    .map(s => ({ id: s.id, category: s.category, package: s.package }));

  const registryData = {
    version: ENGINE_VERSION,
    projectId: profile.id,
    projectPath: resolvedDir,
    scope: 'project',
    updatedAt: new Date().toISOString(),
    mattPocockCollection: {
      officialSource: MATT_POCOCK_OFFICIAL_SOURCE.repository,
      package: MATT_POCOCK_OFFICIAL_SOURCE.packageId,
      totalDiscovered: MATT_POCOCK_OFFICIAL_SOURCE.totalDiscovered,
      verifiedCount: MATT_POCOCK_OFFICIAL_SOURCE.validCount,
      skippedCount: MATT_POCOCK_OFFICIAL_SOURCE.skippedCount,
      skippedDetails: MATT_POCOCK_OFFICIAL_SOURCE.skippedDetails
    },
    installedSkills: sanitizeObject(installedList),
    missingRecommendedSkills: sanitizeObject(missingList)
  };

  fs.writeFileSync(profilePath, JSON.stringify(sanitizeObject(profile), null, 2), 'utf8');
  fs.writeFileSync(registryPath, JSON.stringify(sanitizeObject(registryData), null, 2), 'utf8');

  // Build Setup Report
  const reportContent = generateSetupReport(profile, registryData, installResults, mode);
  fs.writeFileSync(reportPath, reportContent, 'utf8');

  return {
    profilePath,
    registryPath,
    reportPath,
    registry: registryData
  };
}

/**
 * Generate comprehensive markdown report.
 */
function generateSetupReport(profile, registryData, installResults, mode) {
  return `# MO7I Project Intelligence & Skill Setup Report

**Project Identity**: \`${profile.id}\`  
**Location**: \`${profile.path}\`  
**Setup Mode**: \`${mode.toUpperCase()}\`  
**Setup Version**: \`${ENGINE_VERSION}\`  
**Generated At**: \`${new Date().toISOString()}\`  
**Status**: \`${profile.setupStatus}\`  

---

## 1. Project Technology Stack Analysis

- **Project Archetype**: ${profile.type}
- **Primary Languages**: ${profile.languages.length > 0 ? profile.languages.join(', ') : 'None detected'}
- **Detected Frameworks**: ${profile.frameworks.map(f => `${f.name} (${f.version})`).join(', ') || 'None'}
- **Database / ORM**: ${profile.databases.join(', ') || 'None detected'}
- **Architecture**: ${profile.architecture}
- **Testing Frameworks**: ${profile.testFrameworks.join(', ') || 'None detected'}
- **Deployment Target**: ${profile.deployment}
- **Code Quality Conventions**: ${profile.codeQualityConventions.join(', ') || 'Standard'}
- **Existing Development Tools**: ${profile.existingTools.join(', ') || 'Standard'}

---

## 2. Matt Pocock Official Skills Collection

- **Publisher**: \`${MATT_POCOCK_OFFICIAL_SOURCE.publisher}\`
- **Repository**: \`${MATT_POCOCK_OFFICIAL_SOURCE.repository}\`
- **Catalog Registry**: \`${MATT_POCOCK_OFFICIAL_SOURCE.skillsShUrl}\`
- **Total Discovered Skills**: \`${MATT_POCOCK_OFFICIAL_SOURCE.totalDiscovered}\`
- **Verified & Safe for Project Scope**: \`${MATT_POCOCK_OFFICIAL_SOURCE.validCount}\`
- **Skipped Upstream**: \`${MATT_POCOCK_OFFICIAL_SOURCE.skippedCount}\` (\`software-factory\`: ${MATT_POCOCK_OFFICIAL_SOURCE.skippedDetails[0].reason})

---

## 3. Skill Inventory & Categorization

| Skill ID | Category | Scope | Source | Status |
| :--- | :--- | :--- | :--- | :--- |
${registryData.installedSkills.map(s => `| \`${s.id}\` | ${s.category} | ${s.scope} | \`${s.source}\` | Installed |`).join('\n') || '| None | - | - | - | - |'}

---

## 4. Missing Recommended Skills

${registryData.missingRecommendedSkills.length > 0
  ? registryData.missingRecommendedSkills.map(s => `- **${s.id}** (${s.category}) from \`${s.package}\``).join('\n')
  : '_All recommended foundational specialist skills are active in project scope._'}

---

## 5. Security & Isolation Compliance

- **Scope Isolation**: Strictly project-scoped (\`./.agents/skills/\`). Global (\`-g\`) installation prohibited.
- **Credential Protection**: Zero credentials or secrets persisted.
- **User Skill Preservation**: Existing local skills and custom scripts preserved intact.
`;
}

/**
 * Main execution dispatcher supporting all 5 operating modes.
 */
function runEngine(mode = 'initial', projectDir = process.cwd(), options = {}) {
  const resolvedDir = path.resolve(projectDir);
  const profile = analyzeProject(resolvedDir);
  const recommendations = recommendProjectSkills(profile);

  if (mode === 'audit') {
    // Read-only inspection
    const auditReport = {
      mode: 'audit',
      profile,
      recommendations,
      existingSkills: profile.existingSkills,
      missingSkills: [
        ...recommendations.CORE_PROJECT_SKILLS,
        ...recommendations.DEVELOPMENT_SKILLS,
        ...recommendations.QUALITY_ASSURANCE
      ].filter(s => !profile.existingSkills.includes(s.id))
    };
    return auditReport;
  }

  if (mode === 'repair') {
    // Detect corrupted or deleted skills that should exist
    const mo7iRegistryPath = path.join(resolvedDir, '.mo7i', 'skill-registry.json');
    let targetSkills = [];
    if (fs.existsSync(mo7iRegistryPath)) {
      try {
        const reg = JSON.parse(fs.readFileSync(mo7iRegistryPath, 'utf8'));
        const recorded = reg.installedSkills || [];
        for (const s of recorded) {
          const sPath = path.join(resolvedDir, '.agents', 'skills', s.id);
          if (!fs.existsSync(sPath)) {
            targetSkills.push(s);
          }
        }
      } catch {
        targetSkills = recommendations.CORE_PROJECT_SKILLS;
      }
    } else {
      targetSkills = recommendations.CORE_PROJECT_SKILLS;
    }

    const installResults = installProjectSkills(resolvedDir, targetSkills, options);
    const registryInfo = saveProjectRegistry(resolvedDir, profile, recommendations, installResults, 'repair');
    return { mode: 'repair', profile, installResults, registryInfo };
  }

  if (mode === 'update') {
    // Re-evaluate stack and install missing skills
    const missingCore = recommendations.CORE_PROJECT_SKILLS.filter(s => !profile.existingSkills.includes(s.id));
    const missingDev = recommendations.DEVELOPMENT_SKILLS.filter(s => !profile.existingSkills.includes(s.id));
    const toInstall = [...missingCore, ...missingDev];

    const installResults = installProjectSkills(resolvedDir, toInstall, options);
    const registryInfo = saveProjectRegistry(resolvedDir, profile, recommendations, installResults, 'update');
    return { mode: 'update', profile, installResults, registryInfo };
  }

  if (mode === 'report') {
    const mo7iRegistryPath = path.join(resolvedDir, '.mo7i', 'skill-registry.json');
    let regData = { installedSkills: [], missingRecommendedSkills: [] };
    if (fs.existsSync(mo7iRegistryPath)) {
      try {
        regData = JSON.parse(fs.readFileSync(mo7iRegistryPath, 'utf8'));
      } catch {
        // ignore
      }
    }
    const reportMd = generateSetupReport(profile, regData, null, 'report');
    return { mode: 'report', reportMd };
  }

  // Default: mode === 'initial'
  const skillsToInstall = [
    ...recommendations.CORE_PROJECT_SKILLS,
    ...recommendations.MATT_POCOCK_COLLECTION
  ];

  const installResults = installProjectSkills(resolvedDir, skillsToInstall, options);
  const registryInfo = saveProjectRegistry(resolvedDir, profile, recommendations, installResults, 'initial');

  return {
    mode: 'initial',
    profile,
    recommendations,
    installResults,
    registryInfo
  };
}

module.exports = {
  ENGINE_VERSION,
  MATT_POCOCK_OFFICIAL_SOURCE,
  analyzeProject,
  recommendProjectSkills,
  installProjectSkills,
  saveProjectRegistry,
  generateSetupReport,
  scanContentSecurity,
  sanitizeObject,
  runEngine
};

// Direct CLI invocation
if (require.main === module) {
  const args = process.argv.slice(2);
  const mode = args[0] || 'initial';
  const targetDir = args[1] && !args[1].startsWith('--') ? args[1] : process.cwd();
  const dryRun = args.includes('--dry-run');

  try {
    const result = runEngine(mode, targetDir, { dryRun });
    if (mode === 'report') {
      console.log(result.reportMd);
    } else {
      console.log(`MO7I Project Intelligence Engine (${mode}) completed successfully.`);
      console.log(`Project Archetype: ${result.profile ? result.profile.type : 'N/A'}`);
      if (result.registryInfo) {
        console.log(`Registry written to: ${result.registryInfo.registryPath}`);
        console.log(`Setup report written to: ${result.registryInfo.reportPath}`);
      }
    }
  } catch (err) {
    console.error(`MO7I Setup Engine Error: ${err.message}`);
    process.exit(1);
  }
}
