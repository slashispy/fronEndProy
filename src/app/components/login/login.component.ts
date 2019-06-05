import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from '../../servicios/login.service';
import { Credenciales } from '../../clases/credenciales';
import { AppComponent } from '../../app.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    usuario: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  cre: Credenciales;
  alert: boolean;


  constructor(private loginService: LoginService,
              private router: Router,
              private app: AppComponent) {
                app.navBar = false;
               }

  ngOnInit() {
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }
    const credenciales = this.loginForm.value;
    this.cre = credenciales;
    this.loginService.login(credenciales)
    .subscribe(resp => {
      this.router.navigate(['/home']);
      this.app.navBar = true;
    }, errorCode => {
      this.alert = true;
    } );
  }

}
