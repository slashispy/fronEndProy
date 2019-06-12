import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { LoginService } from '../../../servicios/login.service';
import { first } from 'rxjs/operators';
import { Usuario } from '../../../clases/usuario';
import { AppComponent } from '../../../app.component';
import { Perfil } from '../../../clases/perfil';
import { AlertService } from '../../../servicios/alert.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html'
})
export class RegistrarComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  permisos: Perfil[];
  permisosAsignados: Perfil[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private alertService: AlertService,
    private app: AppComponent
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', Validators.required],
      usuario: ['', Validators.required],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      perfiles: []
    });

    this.loginService.getAllProfiles()
    .subscribe(
      resp => {
        this.permisos = resp;
      },
      errorCode => {
        this.alertService.error(errorCode);
      }
    );

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
                this.alertService.error(error);
            });
}

drop(event: CdkDragDrop<string[]>) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    console.log(this.permisosAsignados);
    transferArrayItem(event.previousContainer.data,
                      event.container.data,
                      event.previousIndex,
                      event.currentIndex);
    this.registerForm.controls['perfiles'].setValue(this.permisosAsignados);
  }
}

}
