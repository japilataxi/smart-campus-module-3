# Static Analysis - ESLint and TypeScript Compiler

## Objective

This folder contains the documentation and evidence structure for the static analysis phase of the Smart Campus Module 3 QA work.

The objective of static analysis is to inspect the source code without executing the application, in order to detect code quality issues, syntax problems, typing errors, and rule violations before runtime.

## Tools Used

The selected tools for this phase are:

- ESLint.
- TypeScript Compiler.

ESLint is used to validate coding rules, detect unsafe patterns, unused variables, unhandled promises, and style or quality issues according to the configuration already defined in each application.

The TypeScript Compiler is used with `--noEmit` to validate types without generating build artifacts or modifying project files.

## Scope

The static analysis phase covers:

- NestJS microservices.
- Next.js frontend application.
- Selenium QA tests written in TypeScript.

The analysis will reuse the existing ESLint and TypeScript configurations already present in the project.

## Static Analysis vs Dynamic Testing

Static analysis reviews the code without running the application. It helps detect problems early in the development process, before the software is deployed or executed.

Dynamic testing executes the application or system behavior, such as Selenium functional tests, OWASP dependency scans, or JMeter performance tests.

In this project, static analysis complements the previous QA phases by validating code quality and type safety before runtime.

## Detectable Issues

The tools selected for this phase can help detect:

- Syntax errors.
- Type checking problems.
- Unused variables.
- Unhandled or floating promises.
- Incorrect type usage.
- Violations of coding rules.
- Inconsistent patterns against the configured ESLint rules.

## Safe Execution Criteria

For ESLint, safe commands must not use `--fix`, because `--fix` modifies source files automatically.

For TypeScript, the compiler must be executed with `--noEmit`, because this validates types without generating output files.

## Future Evidence Organization

The evidence for this phase will be organized as follows:

```text
qa/static-analysis/
|-- reports/      # ESLint and TypeScript execution outputs
|-- screenshots/  # Visual evidence of terminal executions or reports
|-- summary/      # Final written summary of static analysis results
`-- README.md     # Documentation for this QA phase
```

## Current Status

No static analysis has been executed yet.

No ESLint report has been generated yet.

No TypeScript report has been generated yet.

No source code or existing configuration files have been modified for this phase.