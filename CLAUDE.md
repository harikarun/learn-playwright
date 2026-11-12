# Project Self-healing rules

Based on the failures in results.json, claude is expected to update the scripts and make sure they run correctly without any errors. 

## Scope

    - Only edit files in tests folder
    - Never edit package.json or playwright.config.js or .env files

## How to fix
   - Read the failure details in `test-results/results.json` first.
   - Prefer role-based locators (`getByRole`, `getByLabel`, `getByText`) over CSS or XPath.
   - Fix the locator or the wait. Do not delete assertions or tests.
   - Do not add `waitForTimeout` or increase timeouts to hide failures.
   - Never add test.skip / test.fixme.

   ## When NOT to fix
   - If the failure looks like a real application bug (wrong text, missing feature, server error), do not edit the test. Report it instead.

   ## Verify
   - After each fix, run `npx playwright test <file>` and confirm it passes.
   - Keep changes minimal and list what you changed at the end.
