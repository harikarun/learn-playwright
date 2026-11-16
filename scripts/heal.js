// scripts/heal.js
import { query } from '@anthropic-ai/claude-agent-sdk';
import { spawnSync } from 'child_process';

const MAX_ITERATIONS = 3;
const isWin = process.platform === 'win32'; // npx needs a shell on Windows

const run = (cmd, args) =>
  spawnSync(cmd, args, { stdio: 'inherit', shell: isWin });

function runTests() {
  run('npx', ['playwright', 'test']);
  const r = run('node', ['scripts/extract-failures.js']);
  return r.status === 0; // true = no failures
}

const SYSTEM = `You are a test-maintenance agent for a Playwright (JavaScript) suite.
Follow the rules in CLAUDE.md strictly. Work through every failure in
test-results/failures.json, verify each fix by re-running the affected test,
and finish with a short summary of what you changed and why.`;

async function heal() {
  for (let i = 1; i <= MAX_ITERATIONS; i++) {
    console.log(`\n=== Iteration ${i}/${MAX_ITERATIONS} ===`);

    if (runTests()) {
      console.log('All tests green ✅');
      return true;
    }

    for await (const msg of query({
      prompt: 'Fix the failures listed in test-results/failures.json.',
      options: {
        systemPrompt: SYSTEM,
        cwd: process.cwd(),
        allowedTools: ['Read', 'Edit', 'Grep', 'Glob', 'Bash'],
        permissionMode: 'acceptEdits',
        maxTurns: 30,
      },
    })) {
      if (msg.type === 'result') console.log('Agent result:', msg);
    }
  }

  // Final check after the last healing attempt
  const ok = runTests();
  if (!ok) console.error('Still failing after max iterations ❌');
  return ok;
}

const ok = await heal();
process.exit(ok ? 0 : 1);