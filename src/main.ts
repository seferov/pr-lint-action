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
      core.setFailed(`Please fix your PR title to match "${titleRegex}" with "${titleRegexFlags}" flags`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
