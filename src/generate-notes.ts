import {Gerrit} from "./gerrit/gerrit";

export const generateNotes = async (pluginConfig: any, context: any) => {
  const gerrit: Gerrit = new Gerrit();
  console.log(await gerrit.loadConfig());

  return `hello world`;
};
