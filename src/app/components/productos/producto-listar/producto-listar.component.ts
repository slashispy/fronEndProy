import { Component, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { Credenciales } from '../../../clases/credenciales';
import { Producto } from '../../../clases/producto';

import { Router } from '@angular/router';
import { ProductosService } from '../../../servicios/productos.service';

import { Subject } from 'rxjs';
import { Datatables } from 'src/app/clases/datatables';

@Component({
  selector: 'app-producto-listar',
  templateUrl: './producto-listar.component.html'
})
export class ProductoListarComponent extends Datatables implements OnDestroy, OnInit {
  @Output() idProducto = new EventEmitter<string>();
  productos: Producto[];
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
          this.productos = resp;
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
}
