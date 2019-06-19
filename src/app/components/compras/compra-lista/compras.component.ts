import { Component, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { Credenciales } from '../../../clases/credenciales';
import { Prod, Compra } from '../../../clases/compra';

import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { Datatables } from 'src/app/clases/utils/datatables';
import { ComprasService } from 'src/app/servicios/compras.service';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html'
})
export class ComprasComponent extends Datatables implements OnDestroy, OnInit {
  @Output() idProducto = new EventEmitter<string>();
  compras: Compra[];
  dtTrigger: Subject<any> = new Subject();
  currentUser: Credenciales;

  constructor(private comprasService: ComprasService,
    private router: Router) {
      super();
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
     }

  ngOnInit() {
    super.ngOnInit();
    if (this.currentUser != null) {
      this.comprasService.getAllCompras(this.currentUser.token)
      .subscribe(
        resp => {
          this.compras = resp;
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

  editCompra(id: string): void {
    localStorage.removeItem('compraId');
    localStorage.setItem('compraId', id);
    this.router.navigate(['compra-editar']);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  refreshList() {
    // this.service.getOrderList().then(res => this.orderList = res);
  }

  openForEdit(orderID: number) {
    this.router.navigate(['/order/edit/' + orderID]);
  }

  onOrderDelete(id: number) {
    if (confirm('Are you sure to delete this record?')) {
      /*this.service.deleteOrder(id).then(res => {
        this.refreshList();
        this.toastr.warning("Deleted Successfully", "Restaurent App.");
      });*/
    }
  }
}
