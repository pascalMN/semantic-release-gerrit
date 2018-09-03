import {Gerrit} from "./gerrit/gerrit";
import {Config} from "./gerrit/@types/config";
import {Commit} from "./gerrit/@types/commit";

export const generateNotes = async (pluginConfig: any, context: any) => {
  const gerrit: Gerrit = new Gerrit();
  const {
    commits,
    lastRelease,
    nextRelease,
  } = context;

  const config: Config = await gerrit.loadConfig();
  const parserCommits: Commit[] = gerrit.parseCommits(commits, config.parser);

  return `hello world`;
};
