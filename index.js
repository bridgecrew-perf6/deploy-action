const core = require("@actions/core");
const github = require("@actions/github");

function getBranch() {
  const REFS_HEADS = "refs/heads/";
  const headRef = process.env.GITHUB_HEAD_REF;
  let branch = headRef || github.context.ref;
  if (branch && branch.indexOf(REFS_HEADS) === 0) {
    branch = branch.substring(REFS_HEADS.length);
  }
  return branch;
}

function getSha() {
  const sha = github.context.sha;
  if (!sha) {
    throw Error(`Invalid sha ${sha}`);
  }
  return sha;
}

try {
  const token = core.getInput("github-token", { required: true });

  const environment = core.getInput("environment", { required: true });
  const branch = getBranch();
  const sha = getSha();

  const owner = github.context.repo.owner;
  const repo = github.context.repo.repo;

  console.log(`environment ${environment}`);
  console.log(`branch ${branch}`);
  console.log(`sha ${sha}`);
  console.log(`owner ${owner}`);
  console.log(`repo ${repo}`);

  const octokit = github.getOctokit(token);

  octokit.rest.repos.createDeployment({
    owner,
    repo,
    ref: sha,
    required_contexts: [],
    environment,
    auto_merge: false,
    payload: {
      branch,
    },
  });

  console.log("Github Deployment created");
} catch (error) {
  core.setFailed(`Error: Failed to create deployment: ${error.message}`);
}
