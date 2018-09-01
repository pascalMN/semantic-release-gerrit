export interface User {
  name: string;
  email: string;
  date: string;
}

export interface Hash {
  long: string;
  short: string;
}

export interface Note {
  title: string;
}

export interface Reference {
  issue: string;
}

export interface Commit {
  author: User;
  body: string;
  commit: Hash;
  committer: User;
  commitDate: Date;
  footer: string;
  gitTags: string;
  hash: string;
  header: string;
  mentions: string[];
  merge: string;
  message: string;
  notes: Note[];
  references: Reference[];
  revert: string;
  scope: string;
  subject: string;
  tree: Hash;
  type: string;
}
