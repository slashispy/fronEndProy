import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Credenciales } from '../../../clases/credenciales';
import { Perfil } from '../../../clases/perfil';
import { Router } from '@angular/router';
import { PerfilesService } from '../../../servicios/perfiles.service';
import { Permiso } from '../../../clases/permiso';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

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
  perfil: Perfil;
  permisosDisponibles: Permiso[];
  permisosAsignados: Permiso[] = [];
  permisosNoAsignados: Permiso[] = [];

  constructor(private perfilesService: PerfilesService,
    private router: Router) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

  ngOnInit() {
    if (this.currentUser != null) {
      const perfilId = localStorage.getItem('perfilId');
      if (!perfilId) {
        alert('Acción Inválida');
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
          console.log(errorCode);
        }
      );
        },
        errorCode => {
        console.log(errorCode);
        // this.alert = true;
      } );
    } else {
      this.router.navigate(['home']);
      return;
    }
  }

  filtrarPermisosNoAsignados() {
    this.permisosDisponibles.forEach(
      (e1) => this.permisosAsignados.forEach(
        (e2) => {
          console.log(e1);
          console.log(e2);
          if (e1.id !== e2.id) {
            console.log('Entro');
            this.permisosNoAsignados.push(e1);
          }
        }
      )
    );
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

}
