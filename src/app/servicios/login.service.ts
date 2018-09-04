import { Injectable } from '@angular/core';

@Injectable()
export class LoginService {
  loginUrl = 'http://localhost:8091/backEndProy/auth/login';

  constructor() { }
}
