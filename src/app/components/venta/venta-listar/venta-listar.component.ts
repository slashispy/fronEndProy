import { Component, OnInit, OnDestroy } from '@angular/core';
import { Datatables } from '../../../clases/utils/datatables';
import { Venta } from '../../../clases/venta';
import { Credenciales } from '../../../clases/credenciales';
import { Subject } from 'rxjs';
import { VentasService } from '../../../servicios/ventas.service';
import { AlertService } from '../../../servicios/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-venta-listar',
  templateUrl: './venta-listar.component.html'
})
export class VentaListarComponent extends Datatables implements OnInit, OnDestroy {

  ventas: Venta[];
  dtTrigger: Subject<any> = new Subject();
  currentUser: Credenciales;

  constructor(private ventasService: VentasService,
    private alertService: AlertService,
    private router: Router) {
    super();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
   }

  ngOnInit() {
    super.ngOnInit();
    if (this.currentUser != null) {
      this.ventasService.getVentaByEstado(this.currentUser.token, 'A')
      .subscribe(
        resp => {
          this.ventas = resp;
          this.dtTrigger.next();
        },
        errorCode => {
          this.alertService.error(errorCode);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  editVenta(id: string): void {
    localStorage.removeItem('ventaId');
    localStorage.setItem('ventaId', id);
    this.router.navigate(['venta-editar']);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}
