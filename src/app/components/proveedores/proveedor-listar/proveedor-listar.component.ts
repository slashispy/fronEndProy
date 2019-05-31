import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Credenciales } from '../../../clases/credenciales';
import { Datatables } from 'src/app/clases/utils/datatables';
import { Proveedor } from 'src/app/clases/proveedor';

import { Router } from '@angular/router';
import { ProveedoresService } from '../../../servicios/proveedores.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-proveedor-listar',
  templateUrl: './proveedor-listar.component.html'
})
export class ProveedorListarComponent extends Datatables implements OnDestroy, OnInit {

  @Output() idProveedor = new EventEmitter<string>();
  proveedores: Proveedor[];
  dtTrigger: Subject<any> = new Subject();
  currentUser: Credenciales;

  constructor(private proveedorService: ProveedoresService,
    private router: Router) {
      super();
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
     }

  ngOnInit() {
    super.ngOnInit();
    if (this.currentUser != null) {
      this.proveedorService.getAllProveedores(this.currentUser.token)
      .subscribe(
        resp => {
          this.proveedores = resp;
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

  editProveedor(id: string): void {
    localStorage.removeItem('proveedorId');
    localStorage.setItem('proveedorId', id);
    this.router.navigate(['proveedor-editar']);
  }

}
