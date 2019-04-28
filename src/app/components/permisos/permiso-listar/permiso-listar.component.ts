import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Credenciales } from '../../../clases/credenciales';
import { Permiso } from '../../../clases/permiso';

import { Router } from '@angular/router';
import { PermisosService } from '../../../servicios/permisos.service';

import { Subject } from 'rxjs';
import { Datatables } from '../../../clases/datatables';

@Component({
  selector: 'app-permiso-listar',
  templateUrl: './permiso-listar.component.html'
})
export class PermisoListarComponent extends Datatables implements OnInit, OnDestroy {
  @Output() idPerfil = new EventEmitter<string>();
  permisos: Permiso[];
  dtTrigger: Subject<any> = new Subject();
  currentUser: Credenciales;

  constructor(private permisosService: PermisosService,
    private router: Router) {
      super();
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
     }

  ngOnInit() {
    super.ngOnInit();
    if (this.currentUser != null) {
      this.permisosService.getAllPermits(this.currentUser.token)
      .subscribe(
        resp => {
          this.permisos = resp;
          this.dtTrigger.next();
        },
        errorCode => {
          console.log(errorCode);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  editPermission(id: string): void {
    localStorage.removeItem('permisoId');
    localStorage.setItem('permisoId', id);
    this.router.navigate(['permiso-editar']);
  }

}
