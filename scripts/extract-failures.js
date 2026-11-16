// scripts/extract-failures.js
import fs from 'fs';

const REPORT = 'test-results/results.json';
const OUT = 'test-results/failures.json';

if (!fs.existsSync(REPORT)) {
  console.error(`Missing ${REPORT}. Did the test run crash before reporting?`);
  process.exit(2);
}

const report = JSON.parse(fs.readFileSync(REPORT, 'utf8'));
const failures = [];
const stripAnsi = (s = '') => s.replace(/\u001b\[[0-9;]*m/g, '');

function walk(suite) {
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests ?? []) {
      const last = test.results?.[test.results.length - 1];
      if (last && ['failed', 'timedOut'].includes(last.status)) {
        failures.push({
          file: spec.file,
          line: spec.line,
          title: spec.title,
          project: test.projectName,
          status: last.status,
          error: stripAnsi(last.error?.message),
          snippet: stripAnsi(last.error?.snippet),
          attachments: (last.attachments ?? [])
            .map((a) => a.path)
            .filter(Boolean),
        });
      }
    }
  }
  (suite.suites ?? []).forEach(walk);
}

(report.suites ?? []).forEach(walk);

fs.writeFileSync(OUT, JSON.stringify(failures, null, 2));
console.log(`${failures.length} failure(s) extracted -> ${OUT}`);
process.exit(failures.length ? 1 : 0); // 0 = all green