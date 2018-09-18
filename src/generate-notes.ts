import {Gerrit} from "./gerrit/gerrit";
import {Config} from "./gerrit/@types/config";
import {Commit} from "./gerrit/@types/commit";
import * as getStream from "get-stream";
import * as intoStream from "into-stream";
import * as writer from "conventional-changelog-writer";
import {GERRIT_HOST_CONFIG} from "./gerrit/config";

export const generateNotes = async (pluginConfig: any, context: any) => {
  const gerrit: Gerrit = new Gerrit();
  const {
    commits,
    lastRelease,
    nextRelease,
  } = context;

  const config: Config = await gerrit.loadConfig();
  const parsedCommits: Commit[] = gerrit.parseCommits(commits, config.parser);
  await gerrit.getReviewData(parsedCommits);

  const previousTag = lastRelease.gitTag || lastRelease.gitHead;
  const currentTag = nextRelease.gitTag || nextRelease.gitHead;
  const changelogContext = {
    version: nextRelease.version,
    gerrit: gerrit.getGerritUrl(context),
    issues: gerrit.getIssuesUrl(context),
    previousTag,
    currentTag,
    commit: GERRIT_HOST_CONFIG.commit,
    linkCompare: currentTag && previousTag,
    projectName: gerrit.getProjectName(context)
  };

  return getStream(intoStream.obj(parsedCommits).pipe(writer(changelogContext, config.writer)));
};
