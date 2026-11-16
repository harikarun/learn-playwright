// scripts/diff-guard.js
import { execSync } from 'child_process';

const BASE = process.argv[2] ?? 'HEAD';
const diff = execSync(`git diff ${BASE} --unified=0`, { encoding: 'utf8' });
const files = execSync(`git diff ${BASE} --name-only`, { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean);

const problems = [];

// 1. Only tests/ and pages/ may change (plus the bug report)
const allowed = (f) =>
  f.startsWith('tests/') ||
  f.startsWith('pages/') ||
  f === 'test-results/suspected-bugs.md';
for (const f of files) {
  if (!allowed(f)) problems.push(`Unauthorized file changed: ${f}`);
}

// 2. Inspect individual changed lines
for (const line of diff.split('\n')) {
  if (line.startsWith('---') || line.startsWith('+++')) continue;
  if (line.startsWith('-') && /expect\s*\(/.test(line)) {
    problems.push(`Assertion removed/changed (review): ${line.trim()}`);
  }
  if (line.startsWith('+') && /\.(skip|fixme)\b/.test(line)) {
    problems.push(`Skip/fixme added: ${line.trim()}`);
  }
  if (line.startsWith('+') && /waitForTimeout\s*\(/.test(line)) {
    problems.push(`Fixed wait added: ${line.trim()}`);
  }
  if (line.startsWith('+') && /timeout\s*:\s*(\d{5,})/.test(line)) {
    problems.push(`Large timeout added: ${line.trim()}`);
  }
}

if (problems.length) {
  console.error('❌ Diff guard failed:\n' + problems.map((p) => ' - ' + p).join('\n'));
  process.exit(1);
}
console.log('✅ Diff guard passed');