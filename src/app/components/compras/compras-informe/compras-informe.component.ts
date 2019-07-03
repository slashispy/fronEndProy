import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Credenciales } from '../../../clases/credenciales';
import { Compra } from '../../../clases/compra';

import { Router } from '@angular/router';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/clases/utils/date-adapter';

import { Subject } from 'rxjs';
import { Datatables } from 'src/app/clases/utils/datatables';
import { ComprasService } from 'src/app/servicios/compras.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { AlertService } from 'src/app/servicios/alert.service';

import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../../servicios/excel.service';

@Component({
  selector: 'app-compras-informe',
  templateUrl: './compras-informe.component.html',
  providers: [{
    provide: DateAdapter, useClass: AppDateAdapter
  }, {
    provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
  }]
})
export class ComprasInformeComponent extends Datatables implements OnDestroy, OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  compras: Compra[];
  maxDate = new Date();
  informeForm = new FormGroup({
    desde: new FormControl({value: this.maxDate, disabled: true}, Validators.required),
    hasta: new FormControl({value: this.maxDate, disabled: true}, Validators.required),
    estado: new FormControl('P', Validators.required)
  });
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  currentUser: Credenciales;

  constructor(private comprasService: ComprasService,
    private excelService: ExcelService,
    private router: Router,
    private alerService: AlertService) {
      super();
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
     }

  ngOnInit() {
    super.ngOnInit();
    this.dtOptions = {
      searching: false,
      lengthChange: false,
      destroy: true
    };
    if (this.currentUser != null) {
      const desde = this.formatDate(this.maxDate);
      const hasta = desde;
      this.comprasService.informeCompras(this.currentUser.token, desde, hasta, 'P')
      .subscribe(
        resp => {
          // this.compras = resp;
          this.dtTrigger.next();
        },
        errorCode => {
          this.alerService.error(errorCode);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  buscar() {
    if (this.currentUser != null) {
      const desde = this.formatDate(this.informeForm.controls.desde.value);
      const hasta = this.formatDate(this.informeForm.controls.hasta.value);
      const estado = this.informeForm.controls.estado.value;
      this.comprasService.informeCompras(this.currentUser.token, desde, hasta, estado)
      .subscribe(
        resp => {
          this.compras = resp;
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
          });
        },
        errorCode => {
          this.alerService.error(errorCode);
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  private formatDate(date: Date) {
    const d = new Date(date),
    year = d.getFullYear();
    let month = '' + (d.getMonth() + 1),
        day = '' + d.getDate();

    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }

    return [year, month, day].join('-');
  }

  informe() {
    const doc = new jsPDF();
    const cuerpo = new Array();
    if (typeof this.compras !== 'undefined' && this.compras.length > 0) {
      this.compras.forEach(element => {
        cuerpo.push(new Array(element.id.toString(),
          element.fecha,
          element.nroFactura,
          element.proveedor.razonSocial,
          element.tipoCompra.descripcion,
          element.importe.toString(),
          element.descuento.toString()));
      });
      doc.text('Informe de Compras', 10, 10);
      doc.setFontSize(8);
      doc.text('Desde: ' + this.formatDate(this.informeForm.controls.desde.value), 10, 15);
      doc.text('Hasta: ' + this.formatDate(this.informeForm.controls.hasta.value), 10, 19);
      switch (this.informeForm.controls.estado.value) {
        case 'A':
          doc.text('Estado: Aprobada', 10, 23);
          break;
        case 'P':
          doc.text('Estado: Pendiente', 10, 23);
          break;
        case 'C':
          doc.text('Estado: Cancelada', 10, 23);
          break;
      }
      doc.autoTable({
        margin: {top: 26},
        head: [['Id', 'Fecha', 'Nro de Factura', 'Proveedor', 'Tipo de Compra', 'Importe', 'Descuento']],
        body: cuerpo
      });
      doc.save('informe_compras.pdf');
    }
  }

  exportAsXLSX(): void {
    const data = new Array();
    if (typeof this.compras !== 'undefined' && this.compras.length > 0) {
      this.compras.forEach(element => {
        data.push({Id : element.id.toString(),
          Fecha : element.fecha,
          Nro_factura : element.nroFactura,
          Proveedor : element.proveedor.razonSocial,
          Tipo_de_compra : element.tipoCompra.descripcion,
          Importe : element.importe.toString(),
          Descuento : element.descuento.toString()});
      });
      this.excelService.exportAsExcelFile(data, 'compras_desde_' +
      this.formatDate(this.informeForm.controls.desde.value) + '_hasta_' +
      this.formatDate(this.informeForm.controls.hasta.value) + '_estado_' +
      this.informeForm.controls.estado.value);
    }
  }
}
