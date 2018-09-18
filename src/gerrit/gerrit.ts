import {Config, ParserOptions, WriterOptions} from "./@types/config";
import {FileReader} from "./utils/file-reader";
import {GERRIT_HOST_CONFIG, parserOptions, writerOptionsConfig} from "./config";
import {Commit} from "./@types/commit";
import * as filter from 'conventional-commits-filter';
import * as parser from 'conventional-commits-parser';
import * as exaca from 'execa';
import {Review} from "./@types/review";

export class Gerrit {
  static DEFAULT_PORT = 8080;
  private fileReader = new FileReader(__dirname);

  async loadConfig(): Promise<Config> {
    const writerOptions: WriterOptions = {
      ...writerOptionsConfig,
      mainTemplate: await this.fileReader.readFile(`templates/template.hbs`).toPromise(),
      headerPartial: await this.fileReader.readFile(`templates/header.hbs`).toPromise(),
      commitPartial: await this.fileReader.readFile(`templates/commit.hbs`).toPromise(),
      footerPartial: await this.fileReader.readFile(`templates/footer.hbs`).toPromise(),
    };

    return {
      parser: parserOptions,
      writer: writerOptions
    }
  }

  parseCommits(commits: Commit[], parserOptions: ParserOptions): Commit[] {
    return filter(commits.map(commit => {
      return {
        ...commit,
        ...parser.sync(commit.message, {
          referenceActions: GERRIT_HOST_CONFIG.referenceActions,
          issuePrefixes: GERRIT_HOST_CONFIG.issuePrefixes,
          ...parserOptions
        })
      }
    }));
  }

  getGerritUrl(context): string {
    const gerritPlugin = context.options.generateNotes.find(plugin => plugin.gerritUrl);
    if (gerritPlugin) {
      return gerritPlugin.gerritUrl;
    }
    const tokens: string[] = context.options.repositoryUrl.split('@');
    const host = tokens[1].slice(0, tokens[1].search(':'));
    return `http://${host}:${Gerrit.DEFAULT_PORT}`;
  }

  getProjectName(context): string {
    const tokens = context.options.repositoryUrl.split('/');
    return tokens[tokens.length - 1];
  }

  async getReviewData(commits: Commit[]): Promise<Commit[]> {
    return exaca('git', ['ls-remote']).then((r) => {
      const regexp = new RegExp('refs\\/changes\\/\\d*\\/\\d*\\/\\d*$');
      const remotes: Map<string, string> = new Map(r
        .stdout
        .split('\n')
        .map(line => line.split('\t'))
        .filter(line => line[1].match(regexp))
      );
      commits.forEach(commit => {
        try {
          const remoteData = remotes.get(commit.hash).split('/');
          commit.review = {
            changeNumber: Number(remoteData[remoteData.length - 2]),
            patchSet: Number(remoteData[remoteData.length - 1])
          } as Review;
        } catch (e) {
          console.warn(`Cannot find review for commit: ${commit.message}`)
        }
      })
    });
  }
}
