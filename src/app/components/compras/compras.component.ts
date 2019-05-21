import { Component, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { Credenciales } from '../../clases/credenciales';
import { Compra } from '../../clases/compra';

import { Router } from '@angular/router';
import { ProductosService } from '../../servicios/productos.service';

import { Subject } from 'rxjs';
import { Datatables } from 'src/app/clases/datatables';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html'
})
export class ComprasComponent extends Datatables implements OnDestroy, OnInit {
  @Output() idProducto = new EventEmitter<string>();
  compras: Compra[];
  dtTrigger: Subject<any> = new Subject();
  currentUser: Credenciales;

  constructor(private productosService: ProductosService,
    private router: Router) {
      super();
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
     }

  ngOnInit() {
    super.ngOnInit();
    if (this.currentUser != null) {
      this.productosService.getAllProducts(this.currentUser.token)
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

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  editProduct(id: string): void {
    localStorage.removeItem('productoId');
    localStorage.setItem('productoId', id);
    this.router.navigate(['producto-editar']);
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