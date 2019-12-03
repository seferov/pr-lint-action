import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
  try {
    const
      titleRegex = core.getInput('title-regex', {required: true}),
      titleRegexFlags = core.getInput('title-regex-flags') || 'g',
      title = github.context!.payload!.pull_request!.title;

    core.info(`Checking "${titleRegex}" with "${titleRegexFlags}" flags against the PR title: "${title}"`);

    if (!title.match(new RegExp(titleRegex, titleRegexFlags))) {
      core.setFailed(`Please fix your PR title to match "${titleRegex}" with "${titleRegexFlags}" flags, and re-trigger the check by pushing a new commit. See https://github.com/seferov/pr-lint-action#known-issues`);

      const autoCloseMessage = core.getInput('auto-close-message'),
        githubToken = core.getInput('github-token');
      if (autoCloseMessage) {
        if (!githubToken) {
          core.setFailed('To use auto-close feature you must provide github-token. See: https://github.com/seferov/pr-lint-action#auto-close');

          return;
        }

        const client: github.GitHub = new github.GitHub(githubToken),
        pr = github.context.issue;

        client.pulls.createReview({
          owner: pr.owner,
          repo: pr.repo,
          pull_number: pr.number,
          body: autoCloseMessage.replace('%pattern%', titleRegex),
          event: 'COMMENT'
        });
        client.pulls.update({
          owner: pr.owner,
          repo: pr.repo,
          pull_number: pr.number,
          state: 'closed'
        });
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
