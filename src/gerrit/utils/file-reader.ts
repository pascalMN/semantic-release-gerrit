import {Observable, Subject} from "rxjs";
import * as fs from 'fs';
import * as path from 'path';

export class FileReader {
  constructor(private baseDir: string) { }

  readFile(url: string): Observable<string> {
    const readStream$ = new Subject<string>();
    fs.readFile(path.join(this.baseDir, url), {
      flag: 'r',
      encoding: 'utf-8'
    },(err: NodeJS.ErrnoException, data: string) => {
      if (data) {
        readStream$.next(data);
      }
      if (err) {
        readStream$.error(err);
      }
      readStream$.complete();
    });

    return readStream$;
  }
}
