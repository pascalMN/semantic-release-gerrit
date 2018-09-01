import {Observable, Subject} from "rxjs";
import * as fs from 'fs';

export class FileReader {
  readFile(url: string): Observable<string> {
    const readStream$ = new Subject<string>();
    fs.readFile(url, {
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
