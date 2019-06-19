import { Component, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { Credenciales } from '../../../clases/credenciales';
import { Venta } from '../../../clases/venta';

import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { Datatables } from 'src/app/clases/utils/datatables';
import { VentasService } from 'src/app/servicios/ventas.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html'
})
export class VentasComponent extends Datatables implements OnDestroy, OnInit {
  @Output() idProducto = new EventEmitter<string>();
  ventas: Venta[];
  dtTrigger: Subject<any> = new Subject();
  currentUser: Credenciales;

  constructor(private ventasService: VentasService,
    private router: Router) {
      super();
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
     }

  ngOnInit() {
    super.ngOnInit();
    if (this.currentUser != null) {
      this.ventasService.getAllVentas(this.currentUser.token)
      .subscribe(
        resp => {
          this.ventas = resp;
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
}
