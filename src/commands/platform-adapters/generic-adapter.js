/**
 * MO7I Universal Intelligence — Universal Agent & Shell Adapter
 * Version: 2.2.0
 * 
 * Generates official markdown commands in commands/ and .agents/commands/.
 */

const fs = require('fs');
const path = require('path');
const { COMMANDS } = require('../command-registry');

function generateUniversalCommandFiles(targetDir) {
  const commandsDir = path.join(targetDir, 'commands');
  const agentsCommandsDir = path.join(targetDir, '.agents', 'commands');

  for (const dir of [commandsDir, agentsCommandsDir]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const generated = [];

  for (const cmd of COMMANDS) {
    const filename = `${cmd.id}.md`;
    const content = `---
name: "${cmd.trigger}"
description: "${cmd.summary}"
usage: "${cmd.usage}"
readOnly: ${cmd.readOnly}
---

# ${cmd.trigger}

${cmd.description}

## Usage
\`\`\`text
${cmd.usage}
\`\`\`

## Examples
${cmd.examples.map(ex => `- \`${ex}\``).join('\n')}

## Direct Execution
\`\`\`bash
mo7i ${cmd.alias.replace(/^mo7i\s*/, '')} $ARGUMENTS
\`\`\`
`;

    const dest1 = path.join(commandsDir, filename);
    const dest2 = path.join(agentsCommandsDir, filename);

    fs.writeFileSync(dest1, content, 'utf8');
    fs.writeFileSync(dest2, content, 'utf8');
    generated.push(dest1, dest2);
  }

  return {
    commandsDir,
    agentsCommandsDir,
    generated
  };
}

module.exports = {
  generateUniversalCommandFiles
};
