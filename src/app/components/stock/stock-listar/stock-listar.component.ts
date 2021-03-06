import { Component, OnInit, OnDestroy } from '@angular/core';
import { Credenciales } from '../../../clases/credenciales';
import { Stock } from '../../../clases/stock';
import { Router } from '@angular/router';
import { StockService } from '../../../servicios/stock.service';
import { Subject } from 'rxjs';
import { Datatables } from 'src/app/clases/utils/datatables';

import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AlertService } from '../../../servicios/alert.service';
import { ExcelService } from '../../../servicios/excel.service';

@Component({
  selector: 'app-stock-listar',
  templateUrl: './stock-listar.component.html'
})
export class StockListarComponent extends Datatables implements OnInit, OnDestroy {
  stock: Stock[];
  dtTrigger: Subject<any> = new Subject();
  currentUser: Credenciales;

  constructor(private stockService: StockService,
    private excelService: ExcelService,
    private router: Router,
    private alertService: AlertService) {
      super();
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
     }

  ngOnInit() {
    super.ngOnInit();
    if (this.currentUser != null) {
      this.stockService.getAllStock(this.currentUser.token)
      .subscribe(
        resp => {
          this.stock = resp;
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
    this.stock.forEach(element => {
      cuerpo.push(new Array(element.descProducto,
        element.existencias.toString(),
        element.importeEntrada.toString(),
        element.importeGastado.toString(),
        element.precioVenta.toString()));
    });
    doc.text('Informe de Stock', 10, 10);
    doc.autoTable({
      head: [['Producto', 'Existencias', 'Importe en Ventas', 'Importe en Compras', 'Precio Venta']],
      body: cuerpo
    });
    doc.save(this.formatDate() + '_stock.pdf');
  }

  exportAsXLSX(): void {
    const data = new Array();
    this.stock.forEach(element => {
      data.push({Producto : element.descProducto,
        Existencias : element.existencias,
        Importe_en_Ventas : element.importeEntrada,
        Importe_en_Compras : element.importeGastado,
        Precio_Venta : element.precioVenta });
    });
    this.excelService.exportAsExcelFile(data, 'productos');
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
