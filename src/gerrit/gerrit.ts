import {Config, WriterOptions} from "./@types/config";
import {FileReader} from "./utils/file-reader";
import {parserOptions, writerOptionsConfig} from "./config";

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
}
