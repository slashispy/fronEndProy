import { Component, OnDestroy, OnInit, EventEmitter, Output } from '@angular/core';
import { Credenciales } from '../../../clases/credenciales';
import { Producto } from '../../../clases/producto';

import { Router } from '@angular/router';
import { ProductosService } from '../../../servicios/productos.service';

import { Subject } from 'rxjs';
import { Datatables } from 'src/app/clases/utils/datatables';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';


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

  informe() {
    const doc = new jsPDF();
    const cuerpo = new Array();
    this.productos.forEach(element => {
      cuerpo.push(new Array(element.codigo,
        element.descripcion,
        element.estado,
        element.controlarStock,
        element.cantidadMinima.toString()));
    });
    doc.text('Informe de Productos', 10, 10);
    doc.autoTable({
      head: [['Código', 'Descripción', 'Estado', 'Controlar Stock', 'Cantidad Mínima']],
      body: cuerpo
  });
    doc.save(this.formatDate() + '_productos.pdf');
  }

  private formatDate() {
    const d = new Date();
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }
    return [year, month, day].join('-');
  }
}
