import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/servicios/login.service';
import { first } from 'rxjs/operators';
import { Usuario } from '../../clases/usuario';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html'
})
export class RegistrarComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private app: AppComponent
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', Validators.required],
      usuario: ['', Validators.required],
      clave: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }
    const usuario: Usuario = this.registerForm.value;
    usuario.estado = 'A';
    this.loading = true;
    this.loginService.registrarse(usuario)
        .pipe(first())
        .subscribe(
            data => {
              this.app.navBar = true;
                this.router.navigate(['/home']);
            },
            error => {
                this.loading = false;
            });
}

}
