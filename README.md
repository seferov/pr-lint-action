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

## Known Issues

After a failing job **just** correcting title results in both failed and successful statutes.
This is a limitation on GitHub since just editing pull request title does not count as a *change*, thus doesn't overwrite failing status.
To overcome this, after correcting title empty commit can be sent

`git commit --allow-empty -m "title corrected"`
