import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Credenciales } from '../../../clases/credenciales';
import { Perfil } from '../../../clases/perfil';
import { Permiso } from '../../../clases/permiso';

import { Router } from '@angular/router';
import { PerfilesService } from '../../../servicios/perfiles.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-perfil-crear',
  templateUrl: './perfil-crear.component.html'
})
export class PerfilCrearComponent implements OnInit {
  perfilForm = new FormGroup({
    codigo: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
    estado: new FormControl('A', Validators.required),
    permisos: new FormControl([], Validators.required)
  });
  currentUser: Credenciales;
  perfil: Perfil;
  permisosDisponibles: Permiso[];
  permisosAsignados: Permiso[] = [];

  constructor(private perfilesService: PerfilesService,
    private router: Router) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

  ngOnInit() {
    if (this.currentUser != null) {
      this.perfilesService.getAllPermits(this.currentUser.token)
      .subscribe(
        resp => {
          this.permisosDisponibles = resp;
        },
        errorCode => {
          console.log(errorCode);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  nuevoPerfil() {
    if (this.perfilForm.invalid) {
      return;
    }
    const prof = this.perfilForm.value;
    this.perfil = prof;
    if (this.currentUser != null) {
      this.perfilesService.addProfile(this.perfil, this.currentUser.token)
      .subscribe(
        resp => {
          this.router.navigate(['/perfiles']);
        },
        errorCode => {
        console.log(errorCode);
        // this.alert = true;
      } );
    }
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
      this.perfilForm.controls['permisos'].setValue(this.permisosAsignados);
    }
  }

}
