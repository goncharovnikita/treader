import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {
  private readonly UPDATE_LEXICON_URL = '/user/update/lexicon';
  constructor(
    private $auth: AuthService
  ) {}

  updateLexicon(v: {lang: string, words: string[]}) {
    this.$auth.post(this.UPDATE_LEXICON_URL, v).subscribe(() => {});
  }
}
