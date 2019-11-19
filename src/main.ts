import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
  try {
    const titleRegex = core.getInput('title-regex', {required: true});
    const regexFlags = core.getInput('regex-flags');
    core.debug(`Checking ${titleRegex} against the PR title`);

    const title = github.context!.payload!.pull_request!.title;
    console.log(`title: ${title}`);

    const requiredPattern = regexFlags
      ? new RegExp(titleRegex, regexFlags)
      : new RegExp(titleRegex);

    if (!title.match(requiredPattern)) {
      core.setFailed(`Please fix your PR title to match ${titleRegex}`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
