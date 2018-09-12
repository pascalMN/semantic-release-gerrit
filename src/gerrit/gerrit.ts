import {Config, ParserOptions, WriterOptions} from "./@types/config";
import {FileReader} from "./utils/file-reader";
import {GERRIT_HOST_CONFIG, parserOptions, writerOptionsConfig} from "./config";
import {Commit} from "./@types/commit";
import * as filter from 'conventional-commits-filter';
import * as parser from 'conventional-commits-parser';
import * as exaca from 'execa';
import {Review} from "./@types/review";

export class Gerrit {
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
    //TODO: generate gerrit url base on repository url
  }

  async getReviewData(commits: Commit[]): Promise<Commit[]> {
    return exaca('git', ['ls-remote']).then((r) => {
      const remotes: Map<string, string> = new Map(r.stdout.split('\n').map(line => line.split('\t')));
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
