# **semantic-release-gerrit**

Customizable plugin for [semantic-release](https://github.com/semantic-release/semantic-release) to support projects in the [Gerrit](https://www.gerritcodereview.com) repositories

[![Build Status](https://travis-ci.com/pascalMN/semantic-release-gerrit.svg?branch=master)](https://travis-ci.com/pascalMN/semantic-release-gerrit)
[![npm latest version](https://img.shields.io/npm/v/semantic-release-gerrit/latest.svg)](https://www.npmjs.com/package/semantic-release-gerrit)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)


## generateNotes

Generates notes using [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) with ability to generate Gerrit review commit URL's.
Also in notes header there is option to add Gerrit tag URL if there is [gitiles](https://gerrit.googlesource.com/gitiles/) plugin installed.

### Options

```json
"generateNotes": [
  {
    "path": "semantic-release-gerrit",
    "gerritUrl": "http://localhost:8080",
    "issuesUrl": "http://jira.com/browse"
  }
]
```

| Option       | Description                                                                                                                                                                                                                                                                                        | Default   |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `gerritUrl`  | URL to [Gerrit](https://www.gerritcodereview.com) dashboard                                                                                                                                                           | If not specified dashboard URL will be generated from repository URL         |
| `issuesUrl`  | Optional URL to issues browser| -         |

### Usage

The plugin is used by [semantic-release](https://github.com/semantic-release/semantic-release) in **generateNotes** stage. Thanks for this commit URL's in notes indicates reviews in Gerrit dashboard.


