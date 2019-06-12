import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Credenciales } from '../../../clases/credenciales';
import { Perfil } from '../../../clases/perfil';
import { Router } from '@angular/router';
import { PerfilesService } from '../../../servicios/perfiles.service';
import { Permiso } from '../../../clases/permiso';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AlertService } from 'src/app/servicios/alert.service';

@Component({
  selector: 'app-perfil-editar',
  templateUrl: './perfil-editar.component.html'
})
export class PerfilEditarComponent implements OnInit {
  perfilForm = new FormGroup({
    id: new FormControl('', Validators.required),
    codigo: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
    estado: new FormControl('A', Validators.required),
    permisos: new FormControl([], Validators.required)
  });

  currentUser: Credenciales;
  submitted = false;
  perfil: Perfil;
  permisosDisponibles: Permiso[];
  permisosAsignados: Permiso[] = [];
  permisosNoAsignados: Permiso[] = [];

  constructor(private perfilesService: PerfilesService,
    private alertService: AlertService,
    private router: Router) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

  ngOnInit() {
    if (this.currentUser != null) {
      const perfilId = localStorage.getItem('perfilId');
      if (!perfilId) {
        this.router.navigate(['home']);
        return;
      }
      this.perfilesService.getProfile(this.currentUser.token, perfilId)
      .subscribe(
        resp => {
          this.perfilForm.controls['id'].setValue(resp.id);
          this.perfilForm.controls['codigo'].setValue(resp.codigo);
          this.perfilForm.controls['codigo'].disable();
          this.perfilForm.controls['descripcion'].setValue(resp.descripcion);
          this.perfilForm.controls['estado'].setValue(resp.estado);
          this.perfilForm.controls['permisos'].setValue(resp.permisos);
          this.permisosAsignados = resp.permisos;
          this.perfilesService.getAllPermits(this.currentUser.token)
          .subscribe(
            resp2 => {
            this.permisosDisponibles = resp2;
            this.filtrarPermisosNoAsignados();
          },
        errorCode => {
          this.alertService.error(errorCode);
        }
      );
        },
        errorCode => {
          this.alertService.error(errorCode);
      } );
    } else {
      this.router.navigate(['home']);
      return;
    }
  }

  filtrarPermisosNoAsignados() {
    let band = false;
    for (let i = 0; i < this.permisosDisponibles.length; i++) {
      band = false;
      for (let j = 0; j < this.permisosAsignados.length; j++) {
        if (this.permisosDisponibles[i].id ===  this.permisosAsignados[j].id) {
          band = true;
        }
      }
      if (!band) {
        this.permisosNoAsignados.push(this.permisosDisponibles[i]);
      }
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
      this.perfilForm.controls['permisos'].setValue(this.permisosAsignados);
    }
  }

  get f() { return this.perfilForm.controls; }

  editarPerfil() {
    this.submitted = true;
    if (this.perfilForm.invalid) {
      this.alertService.error('Formulario invalido, favor verificar los campos');
      return;
    }
    const pro = this.perfilForm.value;
    console.log(pro);
    this.perfil = pro;
    if (this.currentUser != null) {
      this.perfilesService.editProfile(pro, this.currentUser.token)
      .subscribe(
        resp => {
          this.router.navigate(['/perfiles']);
        },
        errorCode => {
          this.alertService.error(errorCode);
      } );
    }
  }

}
