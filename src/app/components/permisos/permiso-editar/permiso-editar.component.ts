import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Credenciales } from '../../../clases/credenciales';
import { Permiso } from '../../../clases/permiso';

import { Router } from '@angular/router';
import { PermisosService } from '../../../servicios/permisos.service';

@Component({
  selector: 'app-permiso-editar',
  templateUrl: './permiso-editar.component.html'
})
export class PermisoEditarComponent implements OnInit {
  permisoForm = new FormGroup({
    id: new FormControl('', Validators.required),
    codigo: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required)
  });
  currentUser: Credenciales;
  permiso: Permiso;

  constructor(private permisosService: PermisosService,
    private router: Router) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

  ngOnInit() {
    if (this.currentUser != null) {
      const permisoId = localStorage.getItem('permisoId');
      if (!permisoId) {
        alert('Acción Inválida');
        this.router.navigate(['home']);
        return;
      }
      this.permisosService.getPermission(this.currentUser.token, permisoId)
      .subscribe(
        resp => {
          this.permisoForm.controls['id'].setValue(resp.id);
          this.permisoForm.controls['codigo'].setValue(resp.codigo);
          this.permisoForm.controls['codigo'].disable();
          this.permisoForm.controls['descripcion'].setValue(resp.descripcion);
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

  editarPermiso() {
    if (this.permisoForm.invalid) {
      return;
    }
    const perm = this.permisoForm.value;
    this.permiso = perm;
    if (this.currentUser != null) {
      this.permisosService.editPermission(perm, this.currentUser.token)
      .subscribe(
        resp => {
          this.router.navigate(['/permisos']);
        },
        errorCode => {
        console.log(errorCode);
        // this.alert = true;
      } );
    }
  }

}
