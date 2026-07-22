# Selenium QA Automation

This folder contains the initial structure for functional web testing with Selenium WebDriver and TypeScript for Smart Campus Module 3.

## Purpose

The Selenium test project is isolated inside `qa/selenium` to avoid modifying the application source code, the root monorepo configuration, GitHub Actions, or production dependencies.

## Current structure

- `pages/`: Page Object Model classes for real Smart Campus pages. Test code will use this folder later to represent pages such as Landing, Login, and Dashboard.
- `tests/`: Functional Selenium test cases. No test cases have been created yet.
- `utils/`: Shared QA utilities, such as WebDriver creation, environment loading, waits, screenshots, and report helpers.
- `screenshots/`: Evidence generated during test execution, especially screenshots captured on failure.
- `reports/`: Execution reports showing passed and failed tests.

## Files

- `package.json`: Defines this QA automation folder as an isolated Node.js/TypeScript project. Dependencies are intentionally empty at this stage because Selenium has not been installed yet.
- `tsconfig.json`: Defines TypeScript compilation rules for QA files under `pages`, `tests`, and `utils`.
- `.env.example`: Documents the environment variables that future Selenium tests will use, including the frontend URL, API URL, browser, timeout, and test credentials.
- `README.md`: Documents the QA automation structure and explains how this folder is intended to be used.

## Selenium configuration decision

A separate `selenium.config.ts` file was not created because it is not a standard requirement of Selenium WebDriver. Selenium projects usually create the driver directly in a utility/helper file and read runtime settings from environment variables. This keeps the setup simple, explicit, and easier to defend in a QA review.

## Status

No Selenium test cases have been created yet.
No dependencies have been installed yet.
No application code has been modified.
