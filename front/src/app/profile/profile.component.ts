import { ProfileService } from './profile.service';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from 'firebase/app';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {
  user: Observable<User>;
  statistics: Observable<UserStatistics>;
  lexicon: string[];
  private _heldCounter = 0;
  constructor(
    private $auth: AuthService,
    private $s: ProfileService
  ) {}

  getLexicon(l: Lexicon): string[] {
    this._heldCounter++;
    if (this._heldCounter > 10) {throw new Error('stack overflow'); }
    console.log('get lexicon')
    const result = [];
    for (let i = 0; i < Object.keys(l).length; i++) {
      let counter = 0;
      const langName = Object.keys(l)[i];
      for (let j = 0; j < Object.keys(l[langName]).length; j++) {
        counter += Object.values(l[langName][Object.keys(l[langName])[j]]).length;
      }
      result.push(`${langName} : ${counter} words`);
    }
    console.log(result)
    return result;
  }

  ngOnInit() {
    this.user = this.$auth.fetchAuthState();
    this.statistics = this.$s.fetchUserStatistics();
    this.statistics.subscribe(v => {
      console.log(v);
      if (v) {
        this.lexicon = this.getLexicon(v.Lexicon);
      }
    });
  }
}
