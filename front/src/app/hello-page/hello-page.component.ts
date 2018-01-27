import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-hello-page',
  templateUrl: './hello-page.component.html',
  styleUrls: ['./hello-page.component.sass']
})
export class HelloPageComponent implements OnInit {

  constructor(
    private $auth: AuthService
  ) {}

  login(method: string) {
    console.log(`login ${method}`)
    this.$auth.login(method);
  }

  ngOnInit() {}
}
