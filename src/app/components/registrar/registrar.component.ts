import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { LoginService } from 'src/app/servicios/login.service';
import { first } from 'rxjs/operators';
import { Usuario } from '../../clases/usuario';
import { AppComponent } from '../../app.component';
import { Perfil } from 'src/app/clases/perfil';

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
    private app: AppComponent
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', Validators.required],
      usuario: ['', Validators.required],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      perfilesAsignados: []
    });

    this.loginService.getAllProfiles()
    .subscribe(
      resp => {
        this.permisos = resp;
      },
      errorCode => {
        console.log(errorCode);
      }
    );

  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    console.log(this.registerForm);
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

drop(event: CdkDragDrop<string[]>) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    transferArrayItem(event.previousContainer.data,
                      event.container.data,
                      event.previousIndex,
                      event.currentIndex);
    this.registerForm.controls['perfilesAsignados'].setValue(this.permisosAsignados);
  }
}

}
