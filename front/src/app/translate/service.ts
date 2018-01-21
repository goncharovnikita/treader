import { HttpService } from './../http.service';
import { Observable } from 'rxjs/Observable';
import { Injectable, Inject } from '@angular/core';

@Injectable()
export class TranslateService {
  private translations = new Map();
  private readonly TRANSLATE_URL = '/translate';
  constructor(
    private $h: HttpService,
    @Inject('BASE_URL') private $url: string
  ) {}

  private exists(k: string): boolean {
    return this.translations.has(k);
  }

  private add(f: string, t: string) {
    this.translations.set(f, t);
    this.translations.set(t, f);
  }

  private get(t: string): string {
    return this.translations.get(t);
  }

  private _translateByAPI(w: string): Observable<string> {
    return this.$h.get(this.$url + this.TRANSLATE_URL, {
      params: {'query': w}
    }).map(r => r.result);
  }

  translate(w: string): Observable<string> {
    if (this.exists(w)) {
      return Observable.of(this.get(w));
    }

    return this._translateByAPI(w)
      .switchMap(v => {
        this.add(w, v);
        return Observable.of(v);
      });
  }
}
