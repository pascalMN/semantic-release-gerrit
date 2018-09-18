import {Commit} from "./commit";
import {Context} from "./context";

export interface WriterOptions {
  commitGroupsSort: string;
  commitPartial: string;
  commitsSort: string[];
  footerPartial: string;
  groupBy: string;
  headerPartial: string;
  mainTemplate: string;
  noteGroupsSort: string;
  notesSort: (...args: any[]) => any;
  transform: (commit: Commit, context: Context) => Commit;
}

export interface ParserOptions {
  headerCorrespondence: string[];
  headerPattern: RegExp;
  noteKeywords: string[];
  revertCorrespondence: string[];
  revertPattern: RegExp;
}

export interface Config {
  writer: WriterOptions;
  parser: ParserOptions;
}

export interface HostConfig {
  commit: string;
  issuePrefixes: string[];
  referenceActions: string[];
}

export interface PluginConfig {
  path: string;
  gerritUrl?: string;
  issuesUrl?: string;
}
