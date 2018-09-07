import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from '../../servicios/login.service';
import { Credenciales } from '../../clases/credenciales';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    usuario: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(private loginService: LoginService,
              private router: Router) { }

  ngOnInit() {
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }
    const credenciales = this.loginForm.value;
    this.loginService.login(credenciales)
    .subscribe(successCode => {
      console.log(successCode);
      this.router.navigate(['/home']);
    }, errorCode => {
      console.log(errorCode);
    } );
  }

}
