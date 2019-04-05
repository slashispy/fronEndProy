import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Credenciales } from '../../../clases/credenciales';
import { Permiso } from '../../../clases/permiso';

import { Router } from '@angular/router';
import { PermisosService } from '../../../servicios/permisos.service';

@Component({
  selector: 'app-permiso-crear',
  templateUrl: './permiso-crear.component.html'
})
export class PermisoCrearComponent implements OnInit {
  permisoForm = new FormGroup({
    codigo: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required)
  });
  currentUser: Credenciales;
  permiso: Permiso;

  constructor(private permisoService: PermisosService,
    private router: Router) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

  ngOnInit() {
    if (this.currentUser != null) {
      // something
    } else {
      this.router.navigate(['/login']);
    }
  }

  nuevoPermiso() {
    if (this.permisoForm.invalid) {
      return;
    }
    const perm = this.permisoForm.value;
    this.permiso = perm;
    if (this.currentUser != null) {
      this.permisoService.addPermission(perm, this.currentUser.token)
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
