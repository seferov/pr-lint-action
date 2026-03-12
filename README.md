# Pull Request Lint

It is a linter of pull requests for [GitHub Actions](https://github.com/features/actions).

## Why?

To enforce pull request titles in the same format will be useful like generating standard changelog messages.
Besides it can be used to parse titles and link with issue tracking systems such as JIRA.

## Example:

```yaml
name: PR lint

on:
  pull_request:
    types: ['opened', 'edited', 'reopened', 'synchronize']

jobs:
  pr-lint:
    runs-on: ubuntu-latest
    steps:
    - uses: seferov/pr-lint-action@master
      with:
        title-regex: '^\[PROJECT-\d*\](\ )'
        title-regex-flags: 'g' # optional
        error-message: 'Add Jira ID to your title' # optional
```

In this example, for every pull request the title is expected to match `^\[PROJECT-\d*\]\ ` regex with a global flag `g`. For instance, `[PROJECT-123] lorem ipsum` or `[PROJECT-2345] dolor sit amet` are valid titles for this example. You can customize the title regex for your needs. The regex flags configuration is optional.

## Auto-close

It can be configured to close pull request automatically if the title does not match the pattern provided. To do so, `github-token` and `auto-close-message` options must be configured.
In the message, `%pattern%` is replaced with the actual the pattern provided. Here is an [example pull request](https://github.com/seferov/pr-lint-action/pull/25).

Config:

```diff
name: PR lint

on:
  pull_request:
    types: ['opened', 'edited', 'reopened', 'synchronize']

jobs:
  pr-lint:
    runs-on: ubuntu-latest
    steps:
    - uses: seferov/pr-lint-action@master
      with:
        title-regex: '^\[PROJECT-\d*\](\ )'
+       github-token: ${{ secrets.GITHUB_TOKEN }}
+       auto-close-message: 'Closing this pull request since the title does not match %pattern% pattern. Please fix the title and re-open the pull request.'
```

## Build & distribution

- **Source entry point**: The action's implementation lives in TypeScript under `src/main.ts`.
- **Bundled artifact**: During the build step we use `@vercel/ncc` to bundle the source into a single JavaScript file at `dist/index.js` (via `npm run build`).
- **Why `dist/index.js` is committed**: GitHub JavaScript actions are executed directly from the repository contents on the runner. To ensure consumers can run the action without installing Node.js or any build tooling, the compiled `dist/index.js` file is checked into version control and referenced from `action.yml`.
- **Contributor workflow**: When you change code under `src/`, run `npm install` once (if needed) and then `npm run build` to regenerate `dist/index.js` before committing. The repository expects the compiled artifact to be in sync with the TypeScript sources.

## Runtime

- This action is implemented as a JavaScript action and is configured in `action.yml` with `runs.using: 'node20'` and `runs.main: 'dist/index.js'`.
- When you use the action in a workflow (for example `- uses: seferov/pr-lint-action@master` or `- uses: ./` when developing locally), GitHub Actions automatically uses its Node.js 20 runtime to execute the bundled `dist/index.js`; you do not need to set up a Node version in your workflow steps for this action to work.
