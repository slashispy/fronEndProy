import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/servicios/login.service';
import { AlertService } from '../../../servicios/alert.service';
import { first } from 'rxjs/operators';
import { Credenciales } from '../../../clases/credenciales';

@Component({
  selector: 'app-cambiarpass',
  templateUrl: './cambiarPass.component.html'
})
export class CambiarPassComponent implements OnInit {
  cambioPassForm: FormGroup;
  loading = false;
  submitted = false;
  actualizado = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.cambioPassForm = this.formBuilder.group({
      usuario: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nuevoPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, {
      validator: ChPassValidator.validate.bind(this)
    });
  }

  get f() { return this.cambioPassForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.cambioPassForm.invalid) {
        return;
    }
    const credencial: Credenciales = this.cambioPassForm.value;
    this.loading = true;
    this.loginService.cambiarPassword(credencial)
        .pipe(first())
        .subscribe(
            data => {
              this.loading = false;
              this.actualizado = true;
              this.alertService.success('Contraseña fue cambiada exitosamente');
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
  }
}

export class ChPassValidator {
  static validate(group: FormGroup) {
    const pass = group.controls.nuevoPassword.value;
    const confirmPass = group.controls.confirmarPassword.value;
    if (confirmPass.length <= 0) {
        return null;
    }
    if (confirmPass !== pass) {
      group.get('confirmarPassword').setErrors({ doesMatchPassword: true });

        return {
            doesMatchPassword: true
        };
    }
    return null;
  }
}
