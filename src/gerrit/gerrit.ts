import {Config, ParserOptions, WriterOptions} from "./@types/config";
import {FileReader} from "./utils/file-reader";
import {GERRIT_HOST_CONFIG, parserOptions, writerOptionsConfig} from "./config";
import {Commit} from "./@types/commit";
import * as filter from 'conventional-commits-filter';
import * as parser from 'conventional-commits-parser';

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
}
