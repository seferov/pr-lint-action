# Pull Request Lint

It is a linter of pull requests for [Github Actions](https://github.com/features/actions).

## Why?

To enforce pull request titles in the same format will be useful like generating standard changelog messages .
Besides it can be used to parse titles and link with issue tracking systems such as JIRA.

## Example:

```yaml
name: PR lint

on: [pull_request]

jobs:
  pr-lint:
    runs-on: ubuntu-latest
    steps:
    - uses: seferov/pr-lint-action@master
      with:
        title-regex: '^\[PROJECT-\d*\]\ '
        regex-flags: 'g'
```

In this example, for every pull request the title is expected to match `^\[PROJECT-\d*\]\ ` regex with a global flag `g`. For instance, `[PROJECT-123] lorem ipsum` or `[PROJECT-2345] dolor sit amet` are valid titles for this example. You can customize the title regex for your needs. The regex flags is optional.
