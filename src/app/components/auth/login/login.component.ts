import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../../../servicios/login.service';
import { Credenciales } from '../../../clases/credenciales';
import { AppComponent } from '../../../app.component';
import { first } from 'rxjs/operators';
import { AlertService } from '../../../servicios/alert.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    usuario: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  loading = false;
  submitted = false;
  cre: Credenciales;
  returnUrl: string;


  constructor(private loginService: LoginService,
              private router: Router,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private app: AppComponent) {
                app.navBar = false;
               }

  ngOnInit() {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.loginForm.controls; }

  login() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const credenciales = this.loginForm.value;
    this.cre = credenciales;
    this.loginService.login(credenciales)
    .pipe(first())
    .subscribe(resp => {
      this.router.navigate([this.returnUrl]);
      this.app.navBar = true;
    }, errorCode => {
      console.log(errorCode);
      this.alertService.error(errorCode);
      this.loading = false;
    } );
  }

}
